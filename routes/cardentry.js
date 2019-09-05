import express from 'express';
import {
	cardEntryList,
	addCardEntry,
	deleteCardEntry,
	updateCardEntryListInOneColumn,
	updateCardEntryListInTwoColumn,
	updateCardEntryTitle
} from '../controllers';
import { checkToken } from '../middlewares';

const app = express.Router();

app.get('/cardentry/cardentrylist', checkToken, (req, res) => {
	cardEntryList(req, res);
});

app.post('/cardentry/addcardentry', checkToken, (req, res) => {
	addCardEntry(req, res);
});

app.post('/cardentry/deletecardentry', checkToken, (req, res) => {
	deleteCardEntry(req, res);
});

app.post('/cardentry/updateCardentrylistInOneColumn', checkToken, (req, res) => {
	updateCardEntryListInOneColumn(req, res);
});

app.post('/cardentry/updateCardentrylistInTwoColumn', checkToken, (req, res) => {
	updateCardEntryListInTwoColumn(req, res);
});

app.post('/cardentry/updatecardentrytitle', checkToken, (req, res) => {
	updateCardEntryTitle(req, res);
});
export default app;
