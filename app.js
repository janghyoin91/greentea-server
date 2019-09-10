import express from 'express';
import bodyParser from 'body-parser';
import models from './models';
import cors from 'cors';
import { board, card, cardentry, user } from './routes';

const app = express();
const port = process.env.PORT || 4000;

models.sequelize
	.sync()
	.then(() => {
		console.log('success');
	})
	.catch(() => {
		console.log('DB connection error');
	});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(board);
app.use(card);
app.use(cardentry);
app.use(user);

app.listen(port, function() {
	console.log(`App listening on port ${port}`);
});
