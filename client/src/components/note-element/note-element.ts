// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'

class NoteElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render()
    }

    set noteHeader(noteHeader: any) {
        // @ts-ignore
        this._noteHeader = noteHeader;
        const headerDiv = this.shadowRoot.querySelector('.note-header');
        headerDiv.innerHTML = noteHeader;
    }

    get noteHeader() {
        // @ts-ignore
        return this._noteHeader;
    }

    set noteBody(noteBody: any) {
        // @ts-ignore
        this._noteBody = noteBody;
        const bodyDiv = this.shadowRoot.querySelector('.note-content');
        bodyDiv.innerHTML = noteBody;

    }

    get noteBody() {
        // @ts-ignore
        return this._noteBody;
    }

    set id(id) {
        // @ts-ignore
        this._id = id;
    }

    get id() {
        // @ts-ignore
        return this._id;
    }

    render() {
        const noteTemplate = html`
            <style>
                #note {
                    float: left;
                    margin: 20px;
                    position: relative;
                    width: 200px;
                    min-height: 300px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
                }

                .note-header {
                    padding: 20px 20px 0px 20px;
                    justify-content: space-between;
                    align-items: center;
                }

                .note-body {
                    margin: 20px;
                    border-top: 1px solid #ddd;
                }

                .note-content {
                    height: 100%;
                    outline: none;
                    font-size: 16px;
                    line-height: 1.5;
                }

                .char-counter {
                    position: absolute;
                    right: 0;
                    font-size: 12px;
                    color: black;
                }

                #color-slider {
                    display: none;
                    background: white;
                    border: 1px solid black;
                    z-index: 1;
                    position: absolute;
                    width: 90%;
                    margin: 5%;
                }

                #hue-slider {
                    width: 80%;
                    margin: 10px auto;
                    display: block;
                }

                .options-btn {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    cursor: pointer;
                    border-radius: 50%;
                    background-color: #f2f2f2;
                    color: #333;
                    font-size: 16px;
                    font-weight: bold;
                    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
                }

                .color-slider {
                    display: none;
                }

            </style>

            <div @mousedown=${(e) => this.handleMouseDownEvent(e)} id="note">

                <div @click=${() => this.toggleSlider()} class="options-btn">&#8230;</div>
                <div @input=${(e) => this.changeColor(e)} class="color-slider">
                    <input type="range" min="0" max="360" value="0" id="hue-slider">
                </div>
                <div @input=${(e) => this.charCount(e)} class="note-header" contenteditable="true" data-max-length="10">
                </div>
                <div class="char-counter"></div>
                <div class="note-body">
                    <div @focusout=${(e) => this.saveNote(e)} class="note-content" contenteditable="true"></div>
                </div>
            </div>



        `
        render(noteTemplate, this.shadowRoot);
    }

    toggleSlider() {
        const colorSlider = this.shadowRoot.querySelector(".color-slider") as HTMLDivElement;
        if (colorSlider.style.display == "block") {
            colorSlider.style.display = "none";
        } else {
            colorSlider.style.display = "block";
        }
    }

    changeColor(e) {
        const note = this.shadowRoot.getElementById("note") as HTMLDivElement;
        const hueValue = e.target.value;
        note.style.backgroundColor = `hsl(${hueValue}, 100%, 50%)`;
    }

    async saveNote(e) {
        const noteHeaderDiv = this.shadowRoot.querySelector('.note-header');
        const noteHeaderText = noteHeaderDiv.innerHTML.replace(/\s+/g, '');
        if (noteHeaderText == '') return;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                collectionName: this.getAttribute('boardName'),
                note: {id: this.id, noteHeader: noteHeaderText, noteBody: e.target.innerHTML}
            })
        };

        const response = await fetch('/notes', requestOptions);
        const note = await response.json();
    }

    charCount(e) {
        const charCounter = this.shadowRoot.querySelector(".char-counter") as HTMLDivElement;
        const maxLength = e.target.getAttribute("data-max-length");
        const charCount = e.target.innerText.length;
        if (charCount > maxLength) {

            e.target.innerText = e.target.innerText.substring(0, maxLength);
            charCounter.innerText = `${maxLength}/${maxLength}`;

            // Restore text marker position
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            selection.removeAllRanges();
            selection.addRange(range);

        } else {
            charCounter.innerText = `${charCount}/${maxLength}`;
        }
    }

    setRectDataSet(translateX, translateY) {
        const note = this.shadowRoot.getElementById('note');
        note.setAttribute('data-x', translateX);
        note.setAttribute('data-y', translateY);
    }

    getRect() {
        const note = this.shadowRoot.getElementById('note');
        const {width, height} = note.getBoundingClientRect();
        const x = +(note.dataset.x || 0);
        const y = +(note.dataset.y || 0);

        return {x, y, width, height};
    }

    handleMouseDownEvent(e) {
        const note = this.shadowRoot.getElementById('note');

        if (e.target !== note) {
            return;
        }

        const zIndex = note.style.zIndex;
        const mouseUp = (e) => {
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mousemove', mouseMove);
            note.style.zIndex = zIndex;
        }
        const mouseMove = (e) => {
            const {x, y, width, height} = this.getRect();
            const newX = x + e.movementX;
            const newY = y + e.movementY;
            note.style.transform = `translate(${newX}px,${newY}px)`;
            this.setRectDataSet(newX, newY);
        }

        note.style.zIndex = '9999';
        note.style.transformOrigin = 'top left';
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
    };

}

customElements.define("note-element", NoteElement);