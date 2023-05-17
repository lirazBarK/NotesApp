import { MongoDBClient } from '../services/mongoDB/MongoDBClient'
import { sendSuccessResponse } from './genericResponses/sendSuccessResponse';

const mongoClient = new MongoDBClient();

export const saveNote = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.saveNoteToDB(req.body.note);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const getAllNotes = async (req, res, next) => {
    try{
        let sendResponse = await mongoClient.getNotes(req.query.noteBoardName);
        sendSuccessResponse({response: sendResponse}, res);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

