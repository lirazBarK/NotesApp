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
        const name = this.getAttribute('boardName');
        const response = await fetch(`/notes?collectionName=${name}`);
        const boardNotes = await response.json();
        // waits until the request completes...
        console.log(boardNotes);
        return boardNotes.response;
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
        boardNameP.innerHTML = this.getAttribute('boardName');
    }


}

customElements.define("note-board", NoteBoard);