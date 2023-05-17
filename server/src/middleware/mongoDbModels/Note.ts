import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    noteHeader: {
        type: String,
        required: true,
        trim: true,
       // lowercase: true
    },
    noteBody: {
        type: String,
        trim: true,
    },
    boardName: {
        type: String,
        required: true
    }
    
});

export const Note = mongoose.model("Note", NoteSchema, "NoteList");
