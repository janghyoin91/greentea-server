import express from 'express';
import { logIn, signUp, deleteAccount } from '../controllers';
import { checkToken } from '../middlewares';

const app = express.Router();

app.post('/user/login', (req, res) => {
	logIn(req, res);
});

app.post('/user/signup', (req, res) => {
	signUp(req, res);
});

app.post('/user/deleteaccount', checkToken, (req, res) => {
	console.log('/removeaccount 탈퇴할꼬!!!!!!');
	deleteAccount(req, res);
});

export default app;
