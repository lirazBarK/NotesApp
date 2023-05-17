import { MongoDBClient } from '../services/mongoDB/MongoDBClient'
import { sendSuccessResponse } from './genericResponses/sendSuccessResponse';

const mongoClient = new MongoDBClient();

export const createNoteBoard = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.createNoteBoard(req.body.boardName);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const getAllNoteBoards = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.getAllBoards();
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const editBoardName = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.editBoardName(req.body.oldBoardName, req.body.newBoardName);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    } 
}

export const deleteBoardAndBoardNotes = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.deleteBoardAndBoardNotes(req.params.boardName);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}