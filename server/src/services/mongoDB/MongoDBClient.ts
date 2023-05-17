import mongoose from "mongoose";
import {Note} from '../../middleware/mongoDbModels/Note'
import {Board} from '../../middleware/mongoDbModels/Board'


export class MongoDBClient {
    constructor() {
        this.init()
    }

    init() {
        mongoose.connect(
            `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
            .then(() => console.log('Database connection successful!'))
            .catch((err) => console.error('Database connection error:', err));
    }

    async saveNoteToDB(noteObject) {
        const note = await Note.findOneAndUpdate(
            {id: noteObject.id},
            {
                id: noteObject.id,
                noteHeader: noteObject.noteHeader,
                noteBody: noteObject.noteBody,
                boardName: noteObject.noteBoardName
            },
            {upsert: true});
        return note;
    }

    async getNotes(noteBoardName) {
        const response = await Note.find({boardName: noteBoardName});
        return response;
    }

    async createNoteBoard(boardName) {
        const response = await Board.create({name: boardName});
        return response;
    }

    async getAllBoards() {
        try {
            return await Board.find();
        } catch (e) {
            console.log(e);
        }
    }

    async editBoardName(oldBoardName, newBoardName) {
        try {
            const board = await Board.findOneAndUpdate(
                {name: oldBoardName},
                {name: newBoardName},
                {upsert: false});

            const updatedNotes = await Note.updateMany({boardName: oldBoardName}, {boardName: newBoardName});
            return 'updated successfully';
        } catch (e) {
            console.log(e);
        }
    }

    async deleteBoardAndBoardNotes(boardName) {
        try {
            const board = await Board.deleteOne({name: boardName});
            const updatedNotes = await Note.deleteMany({boardName: boardName});
            return 'deleted successfully';
        } catch (e) {
            console.log(e);
        }
    }
}

