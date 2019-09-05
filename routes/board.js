import express from 'express';
import { boardList, createBoardEntry, deleteBoardEntry, updateBoardEntryTitle } from '../controllers';
import { checkToken } from '../middlewares';

const app = express.Router();

app.post('/board/boardlist', checkToken, (req, res) => {
	console.log('/boardlist 라우터까지 들어왔음!!!!!!');
	boardList(req, res);
});

app.post('/board/createboardentry', checkToken, (req, res) => {
	createBoardEntry(req, res);
});

app.post('/board/deleteboardentry', checkToken, (req, res) => {
	deleteBoardEntry(req, res);
});

app.post('/board/updateboardentrytitle', checkToken, (req, res) => {
	updateBoardEntryTitle(req, res);
});

export default app;
