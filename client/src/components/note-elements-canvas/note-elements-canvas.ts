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
        // @ts-ignore
        this._boardDetails = board;
        this.createBoard(board);
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
        const boardNameContainer = this.shadowRoot.getElementById("board-name");
        boardNameContainer.innerHTML = board.getAttribute('name');

        const notes = board.notes;
        if (typeof notes !== 'undefined') {
            // @ts-ignore
            notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            for (let i = 0; i < notes.length; i++) {
                this.addNote(notes[i])
            }
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
                        <li><a href="#" @click=${(e) => this.addNote(e.target, true)}>Add Note</a></li>
                        <li><a href="#" @click=${(e) => this.openEditDialog(e)}>Edit Board Name</a></li>
                        <li><a href="#" @click=${(e) => this.openDeleteDialog(e)}>Delete Board</a></li>
                    </ul>
                </div>

                <div id="editModal" class="modal">
                    <div class="edit-modal-content">
                        <span @click=${(e) => this.closeEditDialog(e)} class="close">&times;</span>
                        <input type="text" id="editInput" maxlength="10">
                        <button @click=${(e) => this.handleEditDone(e)}>Done</button>
                    </div>
                </div>

                <div id="deleteModal" class="modal">
                    <div class="delete-modal-content">
                        <h2>Are you sure you want to delete the board?</h2>
                        <p>All notes on this board will be deleted</p>
                        <button @click=${(e) => this.deleteBoard(e)}>Delete</button>
                        <button @click=${(e) => this.closeDeleteDialog(e)}>Cancel</button>

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
        dropdownMenu.style.display = dropdownMenu.style.display === "" || dropdownMenu.style.display === "none" ? "block" : "none";
    }

    addNote(target, isNew = false) {
        const notesContainer = this.shadowRoot.querySelector(".notes-canvas-container") as HTMLDivElement;
        const note = document.createElement('note-element');
        note.setAttribute('boardName', this.boardDetails.getAttribute('name'));
        note.classList.add('note');
        if(isNew) {
            note.id = uuidv4();
            notesContainer.appendChild(note)

            const event = new CustomEvent('addNoteImgToBorad', {
                detail: {boardName: this.boardDetails.getAttribute('name')},
                bubbles: true,
                cancelable: true,
                composed: false
            })

            this.dispatchEvent(event);
        } else {
            note.id = target.id;
            // @ts-ignore
            note.noteHeader = target.noteHeader;
            // @ts-ignore
            note.noteBody = target.noteBody;
            notesContainer.appendChild(note)
        }

        note.addEventListener('saveNoteToLocalBoard', (e) => {
            this.saveNoteToLocalBoard(e);
        })

        note.addEventListener('deleteNotefromLocalBoard', (e) => {
            this.deleteNotefromLocalBoard(e);
        })
    }


    saveNoteToLocalBoard(e) {
        // @ts-ignore
        const modifiedNote = e.detail.note;
        const existingNoteIndex = this.boardDetails.notes.findIndex(note => note.id === modifiedNote.id);

        if (existingNoteIndex !== -1) {
            // Modify the existing item
            this.boardDetails.notes = this.boardDetails.notes.map((note, index) => {
                if (index === existingNoteIndex) {
                    return { ...note, noteHeader: modifiedNote.noteHeader, noteBody: modifiedNote.noteBody};
                } else {
                    return note; // Keep other items unchanged
                }
            });
        } else {
            // Add the new item
            const newNote = { id: modifiedNote.id, noteHeader: modifiedNote.noteHeader, noteBody: modifiedNote.noteBody};
            this.boardDetails.notes.push(newNote);
        }
    }

    deleteNotefromLocalBoard(e) {
        // @ts-ignore
        const noteToDelete = e.detail.note;
        const index = this.boardDetails.notes.findIndex((note) => {
            return note.id === noteToDelete.id;
        });

        if (index > -1) {
            this.boardDetails.notes.splice(index, 1);
        }

        // @ts-ignore
        const notes = this.shadowRoot.querySelectorAll('note-element');
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === noteToDelete.id) {
                notes[i].parentNode.removeChild(notes[i]);
                break;
            }
        }

        const event = new CustomEvent('deleteNoteImgFromBoard', {
            detail: {boardName: this.boardDetails.getAttribute('name')},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        this.dispatchEvent(event);
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
            this.boardDetails.setAttribute('name', value);
            this.closeEditDialog(e);
            boardNameContainer.innerHTML = value;
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

    deleteBoard(e) {
        this.boardDetails.deleteBoardAndBoardNotes();
        this.closeDeleteDialog(e);

        const event = new CustomEvent('deleteBoardFromView', {
            detail: {boardName: this.boardDetails.getAttribute('name')},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        this.dispatchEvent(event);
    }

    async connectedCallback() {
    }
}

customElements.define('note-elements-canvas', NoteElementsCanvas)