// @ts-ignore
import {html, render} from '/node_modules/lit-html/lit-html.js'
// @ts-ignore
import {v4 as uuidv4} from '/node_modules/uuid/dist/esm-browser/index.js';

class MainApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    render() {
        const mainTemplate = html`
            <style>
                .page-container {
                    display: grid;
                    grid-template-areas:
             'board-container note-canvas-area note-canvas-area note-canvas-area note-canvas-area note-canvas-area';
                    gap: 10px;
                    background-color: #2196F3;
                    padding: 10px;
                    height: 100%;
                }

                .board-container {
                    grid-area: board-container;
                    background-color: rgba(255, 255, 255, 0.8);
                    text-align: center;
                    padding: 20px 0;
                    font-size: 30px;
                    max-width: 190px;
                }
                
                .note-canvas-area {
                    grid-area: note-canvas-area;
                    background-color: rgba(255, 255, 23, 0.8);
                    text-align: center;
                    padding: 20px 0;
                    font-size: 30px;
                    max-width: 70%;

                }
            </style>

            <div class="page-container">
                <board-container @loadNotes=${(e) => this.loadNotesToCanvas(e)} class="board-container"></board-container>
                <note-elements-canvas class="note-canvas-area"></note-elements-canvas>
                    <!--       <p>this is main-app</p>

            <note-board></note-board>
            <button @click=${(e) => this.addNote(e)}>Add Note</button>
            <div class="note-boards-container">

            </div>
            <div class="notes-container">
                
            </div>-->
            </div>

        `
        render(mainTemplate, this.shadowRoot);
    }

    loadNotesToCanvas(e) {
        const notesCanvas = this.shadowRoot.querySelector(".note-canvas-area");
        // @ts-ignore
        notesCanvas.boardDetails = e.detail
    }

    addNote(e) {
        const notesContainer = this.shadowRoot.querySelector(".notes-container") as HTMLDivElement;
        const note = document.createElement('note-element');
        note.id = uuidv4();
        notesContainer.appendChild(note)
    }




    fetchData() {
        fetch('/notes')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }

    connectedCallback() {
        //make an api call to the backend and load all available notes
        //create and append all loaded notes
        //  this.fetchData();

    }
}

customElements.define('main-app', MainApp);