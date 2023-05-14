import mongoose from "mongoose";
import {NoteSchema} from '../../middleware/mongoDbModels/Note'

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

    saveNoteToDB = async (collectionName, noteObject) => {
        const myModel = mongoose.model(collectionName, NoteSchema);
        const note = new myModel({id: noteObject.id ,noteHeader: noteObject.noteHeader ,noteBody:noteObject.noteBody});
        const savedNote = await note.save();
        console.log(savedNote);
        return savedNote;
    }

    getNotes = async (collectionName) => {
        const notes = mongoose.model('notes', NoteSchema, collectionName);
        const savedNotes = await notes.find().exec();
        console.log(savedNotes);
        return savedNotes;
    }

    createNoteBoard = async (collectionName) => {
        const myModel = await mongoose.model(collectionName, NoteSchema);

        console.log(myModel)
    }

    getAllNoteBoards = async () => {
        try {
            return await mongoose.connection.db.listCollections().toArray();
        } catch (e) {
            console.log(e);
        }
    }
}

