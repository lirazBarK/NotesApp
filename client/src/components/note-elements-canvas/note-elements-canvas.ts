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

    set boardDetails(boardDetails) {
        // @ts-ignore
        this.removePreviousNotes();
        // @ts-ignore
        this._boardDetails = boardDetails;
        const notesContainer = this.shadowRoot.querySelector(".notes-canvas-container") as HTMLDivElement;
        const notes = boardDetails.notes;
        for (let i = 0; i < notes.length; i++) {
            const note = document.createElement('note-element');
            note.setAttribute('boardName', boardDetails.boardName);
            note.classList.add('note');
            note.id = notes[i].id;
            // @ts-ignore
            note.noteHeader = notes[i].noteHeader;
            // @ts-ignore
            note.noteBody = notes[i].noteBody;
            notesContainer.appendChild(note)
        }
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

    render() {
        const noteElementCanvasTemplate = html `
        <div class="notes-canvas-container">
            <button @click=${(e) => this.addNote(e)}>Add Note</button>

        </div>
        `;

        render(noteElementCanvasTemplate, this.shadowRoot);
    }

    addNote(e) {
        const notesContainer = this.shadowRoot.querySelector(".notes-canvas-container") as HTMLDivElement;
        const note = document.createElement('note-element');
        note.setAttribute('boardName', this.boardDetails.boardName);

        note.classList.add('note');
        note.id = uuidv4();
        notesContainer.appendChild(note)
    }

    async connectedCallback() {

    }
}

customElements.define('note-elements-canvas', NoteElementsCanvas)