import Router from 'express';
import {getAllNotes, saveNote, deleteNote} from '../controllers/notes.controller';
export const router = Router();

router.post('/notes', saveNote);
router.get('/notes', getAllNotes);
router.delete('/note/noteId/:noteId', deleteNote)