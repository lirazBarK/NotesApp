import { MongoDBClient } from '../services/mongoDB/MongoDBClient'
import { sendSuccessResponse } from './genericResponses/sendSuccessResponse';

const mongoClient = new MongoDBClient();

export const saveNote = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.saveNoteToDB(req.body.collectionName, req.body.note);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const getAllNotes = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.getNotes(req.query.collectionName);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const createNoteBoard = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.createNoteBoard(req.body.name);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const getAllNoteBoards = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.getAllNoteBoards();
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}