import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // lowercase: true
    }
});

export const Board = mongoose.model("Board", BoardSchema, "BoardList");
