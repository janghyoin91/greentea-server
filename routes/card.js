import express from 'express';
import { cardList, addCard, deleteCard, updateCardList, updateCardTitle } from '../controllers';
import { checkToken } from '../middlewares';

const app = express.Router();

app.post('/card/cardlist', checkToken, (req, res) => {
	cardList(req, res);
});

app.post('/card/addcard', checkToken, (req, res) => {
	addCard(req, res);
});

app.post('/card/deletecard', checkToken, (req, res) => {
	deleteCard(req, res);
});

app.post('/card/updateCardlist', checkToken, (req, res) => {
	updateCardList(req, res);
});

app.post('/card/updatecardtitle', checkToken, (req, res) => {
	updateCardTitle(req, res);
});
export default app;
