import express from 'express';
import bodyParser from 'body-parser';
import models from './models';
import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import jwtConfig from './config/jwt';
// import crypto from 'crypto';
import { board, card, cardentry, user } from './routes';

const app = express();
// const server = http.createServer(app);
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

// app.get('/', (req, res) => {
// 	res.send('success');
// });

// app.get('/board', async (req, res) => {
// 	try {
// 		const board = await boards.findAll();
// 		res.status(200).send(board);
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// });

// app.get('/user', async (req, res) => {
// 	try {
// 		const user = await users.findAll();
// 		res.status(200).send(user);
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// });

// app.post('/login', (req, res) => {});

// app.post('/check', (req, res) => {
// 	const token = req.headers['x-access-token'];

// 	if (!token) {
// 		return res.status(403).json({
// 			success: false,
// 			message: 'not logged in'
// 		});
// 	} else {
// 		jwt.verify(token, jwtConfig.secret, (err, decode) => {
// 			if (err) console.log("Can't decode token");
// 		});
// 	}
// });

// app.get('/allcardlist', async (req, res) => {
// 	const allcard = await cards.findAll();
// 	res.status(200).send(allcard);
// });

// app.post('/commentlist', (req, res) => {
// 	const { cardId } = req.body;

// 	comments.findAll({ where: { card__id: cardId } }).then((comments) => res.json(comments));
// });

// app.post('/commeent', (req, res) => {
// 	const { id } = req.body;

// 	comments.findOne({ where: { id: id } }).then((comment) => res.json(comment.comment));
// });

// app.post('/createcomment', async (req, res) => {
// 	const { cardId, comment } = req.body;

// 	await comments.create({
// 		card__id: cardId,
// 		comment: comment
// 	});

// 	await comments
// 		.findAll({
// 			where: { card__id: cardId }
// 		})
// 		.then((commentlist) => res.json(commentlist));
// });

// app.post('/deletecomment', async (req, res) => {
// 	const { commentId, cardId } = req.body;

// 	await comments.destroy({
// 		where: { id: commentId }
// 	});

// 	await comments
// 		.findAll({
// 			where: { card__id: cardId }
// 		})
// 		.then((comlist) => {
// 			res.json(comlist);
// 		});
// });

// app.post('/updatecontainerid', async (req, res) => {
// 	const { cardTitle, conId } = req.body;

// 	await cards.update({ card_container_id: conId }, { where: { title: cardTitle } });

// 	await cards
// 		.findAll({
// 			where: { card_container_id: conId }
// 		})
// 		.then((contList) => res.json(contList));
// });

// app.post('/updatecomment', async (req, res) => {
// 	const { id, comment } = req.body;

// 	await comments.update({ comment: comment }, { where: { id: id } });
// 	await comments.findOne({ where: { id: id } }).then((comment) => res.json(comment.comment));
// });

// app.post('/description', async (req, res) => {
// 	const { cardId, description } = req.body;

// 	await cards.update({ description: description }, { where: { id: cardId } });
// 	await cards.findOne({ where: { id: cardId } }).then((card) => res.json(card.description));
// });

app.use(board);
app.use(card);
app.use(cardentry);
app.use(user);

app.listen(port, function() {
	console.log(`App listening on port ${port}`);
});
