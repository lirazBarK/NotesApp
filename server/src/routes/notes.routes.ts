import Router from 'express';
import {createNoteBoard, getAllNotes, saveNote, getAllNoteBoards} from '../controllers/notes.controller';
export const router = Router();

router.post('/notes', saveNote);
router.get('/notes', getAllNotes);
router.post('/createNoteBoard', createNoteBoard);
router.get('/getAllNoteBoards', getAllNoteBoards);