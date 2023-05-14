// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'


class BoardContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    render() {
        const boardContainerTemplate = html`
            <style>
                .board-container {
                    display: inline-block;
                }

                h3 {
                    margin: 10px;
                }

                #create-note-btn {
                    margin: 11px;
                }

                #input-container {
                    display: none; /* Hide the input container by default */
                }

                #input-container.show {
                    display: inline-block; /* Show the input container when the button is clicked */
                    align-items: center;
                    justify-content: space-between;
                }

                #input-field {
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    font-size: 16px;
                    width: 80%;
                }

                #save-button {
                    padding: 5px 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    font-size: 16px;
                    cursor: pointer;
                }

                #board-list {
                    margin: 0px;
                    padding: 0px;
                }

            </style>
            <div class="board-container">
                <h3>Boards</h3>
                <button id="create-note-btn" @click=${(e) => this.openInput(e)}>Add Board</button>
                <div id="input-container">
                    <input type="text" id="input-field">
                    <button id="save-button" @click=${(e) => this.createNoteBoard(e)}>Save</button>
                </div>
                <div class="board-list-container">
                    <ul id="board-list">

                    </ul>
                </div>
            </div>
        `;

        render(boardContainerTemplate, this.shadowRoot);
    }

    openInput(e) {
        const inputContainer = this.shadowRoot.getElementById('input-container');
        inputContainer.classList.add('show'); // Show the input container
    };

    createNoteBoard(e) {
        const inputField = this.shadowRoot.getElementById('input-field') as HTMLInputElement;
        const inputContainer = this.shadowRoot.getElementById('input-container');

        const inputValue = inputField.value;

        if (inputValue == '') {
            return;
        }

        inputContainer.classList.remove('show');
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: inputValue})
        };

        // fetch('/createNoteBoard', requestOptions)
        //     .then(response => response.json())
        //     .then(data => console.log(data))
        //     .catch(error => console.error(error));

        const noteBoard = document.createElement('note-board');
        noteBoard.setAttribute('boardName', inputValue)
        noteBoard.setAttribute('activeStatus', 'inactive');
        noteBoard.addEventListener('click', (e) => {
            this.changeActiveAttribute(e);
        });
        inputContainer.after(noteBoard);
        inputField.value = '';
    }

    async getAllNoteBoards() {
        try {
            const response = await fetch('/getAllNoteBoards');
            const noteBoards = await response.json();
            // waits until the request completes...
            console.log(noteBoards);
            return noteBoards;
        }catch (e) {
            console.log(e)
        }
    }

    changeActiveAttribute(e) {
        const boardList = this.shadowRoot.getElementById('board-list');
        const items = boardList.querySelectorAll("note-board");
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.setAttribute('status', 'inactive');
        }
        e.target.setAttribute('status', 'active');
    }

    loadNotesToCanvas(e, boardName) {
        const event = new CustomEvent('loadNotes', {
            detail: {notes: e.target.notes, boardName},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        this.dispatchEvent(event);
    }

    async connectedCallback() {
        const boardList = this.shadowRoot.getElementById('board-list');
        const noteResponse = await this.getAllNoteBoards();
        const noteBoards = noteResponse.response;
        for (let i = 0; i < noteBoards.length; i++) {
            const noteBoard = document.createElement('note-board');
            noteBoard.setAttribute('boardName', noteBoards[i].name)
            noteBoard.setAttribute('activeStatus', 'inactive');
            noteBoard.addEventListener("click", (e) => {
                this.changeActiveAttribute(e);
                this.loadNotesToCanvas(e,  noteBoards[i].name);
            })
            boardList.appendChild(noteBoard)
        }

    }
}

customElements.define('board-container', BoardContainer);