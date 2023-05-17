import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {join} from "node:path";
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {router as notesRouter} from "./routes/notes.routes";
import {router as boardRouter} from "./routes/board.routes";

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use(notesRouter);
app.use(boardRouter);


const clientPath = join(process.cwd(), '..', 'client');
const expressStaticHandler = express.static(clientPath);
app.use(expressStaticHandler);
app.use((_req,res)=>res.sendFile(join(clientPath, 'index.html')));

// app.use((err, req, res, next) => {
//     res.status(500).json({message: err.message});
// });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
