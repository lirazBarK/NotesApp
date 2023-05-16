// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'
// @ts-ignore
import {v4 as uuidv4} from '/node_modules/uuid/dist/esm-browser/index.js';

class NoteElementsCanvas extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set boardDetails(board) {
        // @ts-ignore
        this.removePreviousNotes();
        this.createBoard(board);
        // @ts-ignore
        this._boardDetails = board;
    }

    get boardDetails() {
        // @ts-ignore
        return this._boardDetails;
    }

    removePreviousNotes() {
        const notes = this.shadowRoot.querySelectorAll('.note');

        notes.forEach(note => {
            note.remove();
        });
    }

    createBoard(board) {
        const notesContainer = this.shadowRoot.querySelector(".notes-canvas-container") as HTMLDivElement;
        const boardNameContainer = this.shadowRoot.getElementById("board-name");
        boardNameContainer.innerHTML = board.name;
        const notes = board.notes;


        for (let i = 0; i < notes.length; i++) {
            const note = document.createElement('note-element');
            note.setAttribute('boardName', board.name);
            note.classList.add('note');
            note.id = notes[i].id;
            // @ts-ignore
            note.noteHeader = notes[i].noteHeader;
            // @ts-ignore
            note.noteBody = notes[i].noteBody;
            notesContainer.appendChild(note)
        }
    }

    render() {
        const noteElementCanvasTemplate = html`
            <style>
                .dropdown-menu {
                    display: none;
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }

                .dropdown-menu li {
                    padding: 10px;
                    background-color: #f1f1f1;
                }

                .dropdown-menu li:hover {
                    background-color: #ddd;
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
                }

                .close:hover,
                .close:focus {
                    color: #000;
                    text-decoration: none;
                    cursor: pointer;
                }
                
            </style>
            <div class="notes-canvas-container">
                <div class="dropdown">
                    <button class="dropdown-toggle" @click=${(e) => this.toggleDropdown(e)}>Dropdown</button>
                    <ul class="dropdown-menu">
                        <li><a href="#" @click=${(e) => this.addNote(e)}>Add Note</a></li>
                        <li><a href="#" @click=${(e) => this.openEditDialog(e)}>Edit Board Name</a></li>
                        <li><a href="#" onclick="deleteBoard()">Delete Board</a></li>
                    </ul>
                </div>

                <div id="editModal" class="modal">
                    <div class="modal-content">
                        <span @click=${(e) => this.closeEditDialog(e)} class="close">&times;</span>
                        <input type="text" id="editInput" maxlength="10">
                        <button @click=${(e) => this.handleEditDone(e)}>Done</button>
                    </div>
                </div>

                <div id="modalBackdrop" class="modal-backdrop"></div>
                
                <h1 id="board-name"></h1>

            </div>
        `;

        render(noteElementCanvasTemplate, this.shadowRoot);
    }

    toggleDropdown(e) {
        const dropdownMenu = this.shadowRoot.querySelector(".dropdown-menu") as HTMLUListElement;
        dropdownMenu.style.display = dropdownMenu.style.display === "" ||  dropdownMenu.style.display === "none" ? "block" : "none";
    }

    addNote(e) {
        const notesContainer = this.shadowRoot.querySelector(".notes-canvas-container") as HTMLDivElement;
        const note = document.createElement('note-element');
        note.setAttribute('boardName', this.boardDetails.boardName);

        note.classList.add('note');
        note.id = uuidv4();
        notesContainer.appendChild(note)
    }

    openEditDialog(e) {
        const modal = this.shadowRoot.getElementById("editModal");
        const backdrop = this.shadowRoot.getElementById("modalBackdrop");
        modal.style.display = "block";
        backdrop.style.display = "block";
    }

    handleEditDone(e) {
        const editInput = this.shadowRoot.getElementById("editInput") as HTMLInputElement;
        const value = editInput.value;
        if (value.length <= 10) {
            const boardNameContainer = this.shadowRoot.getElementById("board-name");
            boardNameContainer.innerHTML = value;
            this.boardDetails.name = value;
            this.closeEditDialog(e);
        } else {
            alert("Maximum 10 characters allowed!");
        }
    }

    closeEditDialog(e) {
        const modal = this.shadowRoot.getElementById("editModal");
        const backdrop = this.shadowRoot.getElementById("modalBackdrop");
        modal.style.display = "none";
        backdrop.style.display = "none";
    }

    async connectedCallback() {

    }
}

customElements.define('note-elements-canvas', NoteElementsCanvas)