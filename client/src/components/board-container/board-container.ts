// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'


class BoardContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set boardAmount(amount) {
        // @ts-ignore
        this._boardAmount = amount;
    }

    get boardAmount() {
        // @ts-ignore
        return this._boardAmount;
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

                .board-container-buttons {
                    margin: 11px;
                    width: 125px;
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
                <p>Number of Boards: <span id="board-amount"></span></p>
                <button id="create-board-btn" class="board-container-buttons" @click=${(e) => this.openInput(e)}>Add Board</button>
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

    async createNoteBoard(e) {
        const boardList = this.shadowRoot.getElementById('board-list');
        const boardsAmount = this.shadowRoot.getElementById('board-amount');

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
            body: JSON.stringify({boardName: inputValue})
        };

        const response = await fetch('/board', requestOptions);
        const board = await response.json();

        const noteBoard = document.createElement('note-board');
        // @ts-ignore
        noteBoard.setAttribute('name', inputValue);
        noteBoard.setAttribute('activeStatus', 'inactive');
        noteBoard.addEventListener('click', (e) => {
            this.changeActiveAttribute(e);
            this.loadNotesToCanvas(e);
        });
        noteBoard.click();
        boardList.insertAdjacentElement('afterbegin', noteBoard);
        inputField.value = '';
        this.boardAmount = this.boardAmount + 1;
        boardsAmount.innerHTML = this.boardAmount;
    }

    async getAllNoteBoards() {
        try {
            const response = await fetch('/board');
            const noteBoards = await response.json();
            // waits until the request completes...
            console.log(noteBoards);
            return noteBoards;
        } catch (e) {
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

    async loadNotesToCanvas(e) {
        const event = new CustomEvent('loadNotes', {
            detail: {board: e.target},
            bubbles: true,
            cancelable: true,
            composed: false
        })
        this.dispatchEvent(event);
    }

    removeBoardFromView(boardName) {
        const boardsAmount = this.shadowRoot.getElementById('board-amount');
        const boardList = this.shadowRoot.getElementById('board-list');
        const boardElements = boardList.getElementsByTagName('note-board');
        for (let i = 0; i < boardElements.length; i++) {
            if (boardElements[i].getAttribute('name') === boardName) {
                boardList.removeChild(boardElements[i]);
                break; // Remove only the first occurrence of 'abc'
            }
        }
        this.boardAmount = this.boardAmount -1;
        boardsAmount.innerHTML = this.boardAmount;

    }

    addNoteImgToBoard(boardName) {
        const boardList = this.shadowRoot.getElementById('board-list');
        const boardElements = boardList.getElementsByTagName('note-board');
        for (let i = 0; i < boardElements.length; i++) {
            if (boardElements[i].getAttribute('name') === boardName) {
                // @ts-ignore
                boardElements[i].addNotesImgToBoard();
                break; // Remove only the first occurrence of 'abc'
            }
        }
    }

    deleteNoteImgFromBoard(boardName) {
        const boardList = this.shadowRoot.getElementById('board-list');
        const boardElements = boardList.getElementsByTagName('note-board');
        for (let i = 0; i < boardElements.length; i++) {
            if (boardElements[i].getAttribute('name') === boardName) {
                // @ts-ignore
                boardElements[i].deleteNoteImgFromBoard();
                break; // Remove only the first occurrence of 'abc'
            }
        }
    }

    async connectedCallback() {
        const boardList = this.shadowRoot.getElementById('board-list');
        const boardsAmount = this.shadowRoot.getElementById('board-amount');
        const noteBoardsResponse = await this.getAllNoteBoards();
        // @ts-ignore
        const noteBoards = noteBoardsResponse.response.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        for (let i = 0; i < noteBoards.length; i++) {
            const noteBoard = document.createElement('note-board');
            // @ts-ignore
            noteBoard.setAttribute('name',noteBoards[i].name);
            noteBoard.setAttribute('activeStatus', 'inactive');
            noteBoard.addEventListener("click", (e) => {
                this.changeActiveAttribute(e);
                this.loadNotesToCanvas(e);
            })
            boardList.appendChild(noteBoard)
        }
        this.boardAmount = noteBoards.length;
        boardsAmount.innerHTML = this.boardAmount;

    }
}

customElements.define('board-container', BoardContainer);