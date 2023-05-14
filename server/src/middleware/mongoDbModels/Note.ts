import mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
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
    }
});

//export const Note = mongoose.model("Note", NoteSchema);
