import Router from 'express';
import {getAllNotes, saveNote} from '../controllers/notes.controller';
export const router = Router();

router.post('/notes', saveNote);
router.get('/notes', getAllNotes);
