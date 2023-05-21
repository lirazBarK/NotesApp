// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'

class NoteBoard extends HTMLElement {
    static get observedAttributes() {
        return ['status', 'name'];
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
        switch (name) {
            case 'status':
                const noteBoardContainer = this.shadowRoot.querySelector(".note-board-container");
                if (newValue == 'active') {
                    noteBoardContainer.classList.add(newValue);
                } else {
                    noteBoardContainer.classList.remove(oldValue);
                }
                break;
            case 'name':
                if (oldValue !== newValue) {
                    this.editBoardName(oldValue, newValue);
                }
                break;
        }
    }

    async getAllBoardNotes() {
        const name = this.getAttribute('name');
        const response = await fetch(`/notes?noteBoardName=${name}`);
        const boardNotes = await response.json();
        // @ts-ignore
        this.notes = boardNotes.response;
    }

    async editBoardName(oldValue, newValue) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({oldBoardName: oldValue, newBoardName: newValue})
        };
        const response = await fetch('/editBoardName', requestOptions);
        const board = await response.json();
        const boardNameP = this.shadowRoot.getElementById('board-name') as HTMLElement;
        boardNameP.innerHTML = newValue;
    }

    async deleteBoardAndBoardNotes() {
        console.log('start delete');
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };
        const boardName = this.getAttribute('name');
        const response = await fetch(`/boardAndBoardNotes/boardName/${boardName}`, requestOptions);
        console.log('finish delete');

    }

    addNotesImgToBoard() {
        if (this.notes.length < 9) {
            const noteBoardContainer = this.shadowRoot.querySelector(".note-board-container");
            const img = document.createElement('img');
            img.src = '../../../styles/icons/note.svg';
            img.alt = 'note';
            img.classList.add('note-img');
            noteBoardContainer.appendChild(img);
        }
    }

    deleteNoteImgFromBoard() {
        if (this.notes.length < 9 ) {
            const img = this.shadowRoot.querySelector('img');
            if(img) img.remove();
        }
    }

    async connectedCallback() {
        await this.getAllBoardNotes();
        const iterations = Math.min(9, this.notes.length);
        for (let i = 0; i < iterations; i++) {
            const noteBoardContainer = this.shadowRoot.querySelector(".note-board-container");
            const img = document.createElement('img');
            img.src = '../../../styles/icons/note.svg';
            img.alt = 'note';
            img.classList.add('note-img');
            noteBoardContainer.appendChild(img);
        }
        const boardNameP = this.shadowRoot.getElementById('board-name') as HTMLElement;
        boardNameP.innerHTML = this.getAttribute('name');
    }
}

customElements.define("note-board", NoteBoard);