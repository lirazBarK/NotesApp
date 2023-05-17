import Router from 'express';
import {createNoteBoard,
    getAllNoteBoards,
    editBoardName,
    deleteBoardAndBoardNotes} from '../controllers/boards.controller'
export const router = Router();

router.post('/board', createNoteBoard);
router.get('/board', getAllNoteBoards);
router.post('/editBoardName', editBoardName);
router.delete('/boardAndBoardNotes/boardName/:boardName', deleteBoardAndBoardNotes)