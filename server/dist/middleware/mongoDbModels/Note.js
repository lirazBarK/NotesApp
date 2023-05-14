"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.NoteSchema = new mongoose_1.default.Schema({
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
//# sourceMappingURL=Note.js.map