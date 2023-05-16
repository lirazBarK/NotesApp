// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'

class NoteBoard extends HTMLElement {
    static get observedAttributes() {
        return ['status'];
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render()
    }
    
    set name(name) {
        if(typeof this.name !== 'undefined') {
            //TODO: SAVE NEW NAME TO DATABASE
            this.editBoardName(name);
        }
        // @ts-ignore
        this._name = name;
    }

    get name() {
        // @ts-ignore
        return this._name;
    }

    set notes(notes) {
        // @ts-ignore
        this._notes = notes;
    }

    get notes() {
        // @ts-ignore
        return this._notes;
    }


    render() {
        const noteBoardTemplate = html`
            <style>
                .note-board-container {
                    display: flex;
                    align-content: flex-start;
                    flex-wrap: wrap;
                    height: 170px;
                    position: relative;
                    width: 120px;
                    gap: 1rem;
                    padding: 1rem;
                    margin: 10px;
                    background-color: #fff;
                    border-radius: 0.5rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .note-board-container:hover {
                    background-color: grey;
                }

                .active {
                    background-color: yellow;
                }

                #board-name-container {
                    width: 100%;
                }

                #board-name {
                    font-size: 12px;
                    margin: 0px;
                }

                .note-img {
                    width: 15px;
                    flex-basis: calc(33.33% - 1rem);
                }
            </style>

            <div class="note-board-container">
                <div id="board-name-container">
                    <p id="board-name"></p>
                </div>
            </div>
        `;

        render(noteBoardTemplate, this.shadowRoot);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const noteBoardContainer = this.shadowRoot.querySelector(".note-board-container");
        if (newValue == 'active') {
            noteBoardContainer.classList.add(newValue);
        } else {
            noteBoardContainer.classList.remove(oldValue);
        }
    }

    async getAllBoardNotes() {
        const name = this.name;
        const response = await fetch(`/notes?collectionName=${name}`);
        const boardNotes = await response.json();
        // waits until the request completes...
        console.log(boardNotes);
        return boardNotes.response;
    }

    async editBoardName(name) {
        // const requestOptions = {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         collectionName: this.getAttribute('boardName'),
        //         note: {id: this.id, noteHeader: this.noteHeader, noteBody:  this.noteBody}
        //     })
        // };
        //
        // const response = await fetch('/notes', requestOptions);
        // const note = await response.json();
        // const response =
        const boardNameP = this.shadowRoot.getElementById('board-name') as HTMLElement;
        boardNameP.innerHTML = name;
    }

    async connectedCallback() {
        const noteBoardContainer = this.shadowRoot.querySelector(".note-board-container");

        const notes = await this.getAllBoardNotes();
        // @ts-ignore
        this._notes = notes;
        for (let i = 0; i < notes.length && i < 9; i++) {
            const img = document.createElement('img');
            img.src = '../../../styles/icons/note.svg';
            img.alt = 'note';
            img.classList.add('note-img');
            noteBoardContainer.appendChild(img);
        }
        const boardNameP = this.shadowRoot.getElementById('board-name') as HTMLElement;
        boardNameP.innerHTML = this.name;
    }


}

customElements.define("note-board", NoteBoard);