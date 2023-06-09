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

                .modal {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .modal-backdrop {
                    display: none;
                    position: fixed;
                    z-index: 9998;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                /* The Close Button */
                .close {
                    color: #aaaaaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    margin-right: 5px;
                }

                .close:hover,
                .close:focus {
                    color: #000;
                    text-decoration: none;
                    cursor: pointer;
                }

            </style>

            <div @mousedown=${(e) => this.handleMouseDownEvent(e)} id="note">
                <span @click=${(e) => this.openDeleteDialog(e)} class="close">&times;</span>
                <div @click=${() => this.toggleSlider()} class="options-btn">&#8230;</div>
                <div @input=${(e) => this.changeColor(e)} class="color-slider">
                    <input type="range" min="0" max="360" value="0" id="hue-slider">
                </div>
                <div @focusout=${(e) => this.saveNote(e)}
                     @input=${(e) => this.charCount(e)}
                     class="note-header" contenteditable="true" data-max-length="10">
                </div>
                <div class="char-counter"></div>
                <div class="note-body">
                    <div @focusout=${(e) => this.saveNote(e)} class="note-content" contenteditable="true"></div>
                </div>
            </div>

            <div id="deleteModal" class="modal">
                <div class="delete-modal-content">
                    <h2>Are you sure you want to delete this note?</h2>
                    <button @click=${(e) => this.deleteNote(e)}>Delete</button>
                    <button @click=${(e) => this.closeDeleteDialog(e)}>Cancel</button>

                </div>
            </div>

            <div id="modalBackdrop" class="modal-backdrop"></div>


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
        const noteBodyDiv = this.shadowRoot.querySelector('.note-content');
        const boardName = this.getAttribute('boardName')
        this.noteHeader = noteHeaderDiv.innerHTML;
        this.noteBody = noteBodyDiv.innerHTML;
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                note: {id: this.id,
                    noteHeader: this.noteHeader,
                    noteBody:  this.noteBody,
                    noteBoardName: boardName}
            })
        };

        const response = await fetch('/notes', requestOptions);
        const note = await response.json();

        const event = new CustomEvent('saveNoteToLocalBoard', {
            detail: {note: this},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        this.dispatchEvent(event);
    }

    async deleteNote(e) {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };
        const noteId = this.id;
        const response = await fetch(`/note/noteId/${noteId}`, requestOptions);

        const event = new CustomEvent('deleteNotefromLocalBoard', {
            detail: {note: this},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        this.dispatchEvent(event);
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

    openDeleteDialog(e) {
        const modal = this.shadowRoot.getElementById("deleteModal");
        const backdrop = this.shadowRoot.getElementById("modalBackdrop");
        modal.style.display = "block";
        backdrop.style.display = "block";
    }

    closeDeleteDialog(e) {
        const modal = this.shadowRoot.getElementById("deleteModal");
        const backdrop = this.shadowRoot.getElementById("modalBackdrop");
        modal.style.display = "none";
        backdrop.style.display = "none";
    }

    connectedCallback() {
        const headerDiv = this.shadowRoot.querySelector('.note-header') as HTMLDivElement;

        if (typeof this.noteHeader === 'undefined') {
            headerDiv.focus();
        }
    }

}

customElements.define("note-element", NoteElement);