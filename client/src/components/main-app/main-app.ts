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
                <board-container @loadNotes=${(e) => this.createAndLoadNotesToCanvas(e)}
                                 class="board-container"></board-container>
            </div>

        `
        render(mainTemplate, this.shadowRoot);
    }

    createAndLoadNotesToCanvas(e) {
        let notesCanvas = this.shadowRoot.querySelector(".note-canvas-area");

        if (notesCanvas !== null) {
            notesCanvas.remove();
        }
        const pageContainer = this.shadowRoot.querySelector(".page-container");
        notesCanvas = document.createElement('note-elements-canvas');
        notesCanvas.classList.add("note-canvas-area");
        notesCanvas.addEventListener("deleteBoardFromView", (e) => {
            this.removeCanvasAndDeleteBoard(e);
        })
        notesCanvas.addEventListener("addNoteImgToBorad", (e) => {
            this.addNoteImgToBorad(e);
        })

        pageContainer.appendChild(notesCanvas)
        // @ts-ignore
        notesCanvas.boardDetails = e.detail.board;
    }

    removeCanvasAndDeleteBoard(e) {
        const notesCanvas = this.shadowRoot.querySelector(".note-canvas-area");
        const boardContainer = this.shadowRoot.querySelector('.board-container');

        notesCanvas.remove();
        // @ts-ignore
        boardContainer.removeBoardFromView(e.detail.boardName);
    }

    addNoteImgToBorad(e) {
        const boardContainer = this.shadowRoot.querySelector('.board-container');
        // @ts-ignore
        boardContainer.addNoteImgToBoard(e.detail.boardName);
    }

    connectedCallback() {

    }
}

customElements.define('main-app', MainApp);