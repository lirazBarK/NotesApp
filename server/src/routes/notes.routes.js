"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var notes_controller_1 = require("../controllers/notes.controller");
exports.router = (0, express_1.default)();
exports.router.post('/notes', notes_controller_1.saveNote);
exports.router.get('/notes', notes_controller_1.getAllNotes);
//# sourceMappingURL=notes.routes.js.map