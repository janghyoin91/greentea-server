const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models').sequelize;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtConfig = require('./config/jwt');
const crypto = require('crypto');
const { users, boards, card_containers, cards, comments } = require('./models');
const app = express();
const port = process.env.PORT || 4000;

models
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

app.use((req, res, next) => {
	let token = req.headers['authorization'];
	console.log(token);

	if (token) {
		console.log('토큰존재하는곳');
		console.log(token);
		let decoded = jwt.verify(token, jwtConfig.secret, function(err, decode) {
			if (err) {
				console.log('인증실패~!', err);
				res.json('인증실패');
			}

			if (decode) {
				console.log('decode=true');
				next();
			}
		});
	} else {
		console.log('토큰존재하지않는곳');

		const { email, password, name } = req.body;

		if (name) {
			console.log('saklfjlaFJfjefa!!!!!!!!!!!!!!ldksdfL');
			next();
		} else {
			if (!email || !password) {
				next();
			} else {
				users
					.findOne({
						where: { email: email }
					})
					.then((user) => {
						if (user) {
							const decipher = crypto.createDecipher('aes-256-cbc', 'Mannenidittliv');
							let decipheredPW = decipher.update(user.password, 'base64', 'utf8');
							decipheredPW += decipher.final('utf8');

							console.log('!!!!!!User :    ', user);
							console.log('유저가 입력한 비밀번호:   ', password);
							console.log('DB에 저장되어있는 비밀번호:   ', user.password);
							console.log('복호화한 비밀번호:   ', decipheredPW);

							if (password === decipheredPW) {
								let token = jwt.sign({ email: user.email, name: user.name }, jwtConfig.secret, {
									expiresIn: 60000
								});
								res.status(200).json({
									success: true,
									err: null,
									token,
									userid: user.id,
									username: user.name
								});
							}
						} else {
							res.status(400).json('회원가입해야해');
						}
					});
			}
		}
		console.log('gggggggggggggggggggggggggg');
	}
});

app.get('/', (req, res) => {
	res.send('success');
});

app.get('/board', async (req, res) => {
	try {
		const board = await boards.findAll();
		res.status(200).send(board);
	} catch (err) {
		console.log(err.message);
	}
});

app.get('/user', async (req, res) => {
	try {
		const user = await users.findAll();
		res.status(200).send(user);
	} catch (err) {
		console.log(err.message);
	}
});

app.post('/signup', (req, res) => {
	const { email, name, password } = req.body;

	const cipher = crypto.createCipher('aes-256-cbc', 'Mannenidittliv');
	let cipheredPW = cipher.update(password, 'utf8', 'base64');
	cipheredPW += cipher.final('base64');

	users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			if (user) {
				console.log('!!!!!!!!!!!!!!!!!!!!!email exists!!!!!!!!!!!!!!!!!!!!!!');
				res.json('already exist');
			} else {
				users
					.create({
						name: name,
						email: email,
						password: cipheredPW
					})
					.then((newUser) => {
						console.log('User created: ', newUser);
						res.json('user created!!');
					})
					.catch((err) => console.log(err.message));
			}
		});
});

app.post('/login', (req, res) => {});

app.post('/removeaccount', async (req, res) => {
	console.log('/removeaccount 탈퇴할꼬!!!!!!');
	const { email } = req.body;
	let userid = '';
	let boardidarr = [];
	await users.findOne({ where: { email: email } }).then((user) => {
		userid = user.id;
	});

	await users.destroy({
		where: { id: userid }
	});
	await boards
		.findAll({
			where: { user_id: userid }
		})
		.then((result) => {
			result.forEach((item) => boardidarr.push(item.id));
		});
	await boardidarr.forEach((item) =>
		boards.destroy({
			where: { id: item }
		})
	);
});

app.post('/check', (req, res) => {
	const token = req.headers['x-access-token'];

	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'not logged in'
		});
	} else {
		jwt.verify(token, jwtConfig.secret, (err, decode) => {
			if (err) console.log("Can't decode token");
		});
	}
});

app.post('/boardlist', async (req, res) => {
	console.log('/boardlist 라우터까지 들어왔음!!!!!!');
	const { email } = req.body;
	let id = '';
	console.log('*****************************8');
	await users.findOne({ where: { email: email } }).then((user) => {
		id = user.id;
		console.log('@@@@@@@userid = ');
	});
	await boards
		.findAll({
			where: { user_id: id }
		})
		.then((result) => {
			console.log('result 응답해주는데까지 왔음~!');
			console.log(result);
			res.json(result);
		});
});

app.post('/cardlist', async (req, res) => {
	console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
	console.log(req.headers);
	const { boardId } = req.body;

	await card_containers.findAll({ where: { board_id: boardId } }).then((cardlist) => {
		res.json(cardlist);
	});
});

app.get('/cardentrylist', async (req, res) => {
	await cards.findAll().then((cardentrylist) => {
		res.json(cardentrylist);
	});
});

app.get('/allcardlist', async (req, res) => {
	const allcard = await cards.findAll();
	res.status(200).send(allcard);
});

app.post('/commentlist', (req, res) => {
	const { cardId } = req.body;

	comments.findAll({ where: { card__id: cardId } }).then((comments) => res.json(comments));
});

app.post('/commeent', (req, res) => {
	const { id } = req.body;

	comments.findOne({ where: { id: id } }).then((comment) => res.json(comment.comment));
});

app.post('/createcomment', async (req, res) => {
	const { cardId, comment } = req.body;

	await comments.create({
		card__id: cardId,
		comment: comment
	});

	await comments
		.findAll({
			where: { card__id: cardId }
		})
		.then((commentlist) => res.json(commentlist));
});

app.post('/createboardentry', async (req, res) => {
	const { email, title } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.create({
		user_id: userId,
		title: title
	});

	await boards
		.findAll({
			where: { user_id: userId }
		})
		.then((boardlist) => {
			res.json(boardlist);
		});
});

app.post('/addcard', async (req, res) => {
	const { board, cardtitle } = req.body;
	let boardId = board.id;
	let length = 0;
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await card_containers
		.findAll({
			where: { board_id: boardId }
		})
		.then((containerlist) => {
			length = containerlist.length;
		});

	await card_containers.create({
		board_id: boardId,
		title: cardtitle,
		index: length
	});

	await card_containers
		.findAll({
			where: { board_id: boardId }
		})
		.then((containerlist) => {
			res.json(containerlist.sort(compare));
		});
});

app.post('/addcardentry', async (req, res) => {
	const { cardId, entryTitle } = req.body;
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};
	let index = 0;

	await cards
		.findAll({
			where: { card_container_id: cardId }
		})
		.then((cardlist) => {
			index = cardlist.length;
		});

	await cards.create({
		card_container_id: cardId,
		title: entryTitle,
		index: index
	});

	await cards.findAll().then((cardlist) => {
		res.json(cardlist);
	});
});

app.post('/deleteboardentry', async (req, res) => {
	const { email, boardentryId } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.destroy({
		where: { id: boardentryId }
	});

	await boards
		.findAll({
			where: { user_id: userId }
		})
		.then((list) => {
			res.json(list);
		});
});

app.post('/deletecard', async (req, res) => {
	const { boardId, cardId } = req.body;
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await card_containers.destroy({
		where: { id: cardId }
	});

	await card_containers
		.findAll({
			where: { board_id: boardId }
		})
		.then((cardlist) => res.json(cardlist.sort(compare)));
});

app.post('/deletecardentry', async (req, res) => {
	const { cardId, cardentry } = req.body;
	let newlist = '';
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	try {
		await cards.destroy({
			where: {
				id: cardentry.id
			}
		});
	} catch (err) {
		console.log(err.message);
	}

	cards
		.findAll({
			where: { card_container_id: cardId }
		})
		.then((cardlist) => {
			newlist = cardlist.map((card) => {
				if (card.index > cardentry.index) {
					cards.update({ index: card.index - 1 }, { where: { id: card.id } });
				}
			});
		});

	cards.findAll().then((cardentrylist) => res.json(cardentrylist));
});

app.post('/deletecomment', async (req, res) => {
	const { commentId, cardId } = req.body;

	await comments.destroy({
		where: { id: commentId }
	});

	await comments
		.findAll({
			where: { card__id: cardId }
		})
		.then((comlist) => {
			res.json(comlist);
		});
});
app.post('/updateboardentrytitle', async (req, res) => {
	const { email, boardentryId, title } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.update({ title: title }, { where: { id: boardentryId } });

	await boards.findAll({ where: { id: userId } }).then((list) => res.json(list));
});
app.post('/updatecardentrytitle', async (req, res) => {
	const { cardId, cardentryId, newTitle } = req.body;
	await console.log(cardentryId);
	await console.log(newTitle);
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await cards.update({ title: newTitle }, { where: { id: cardentryId } });

	await cards.findAll().then((cardentrylist) => res.json(cardentrylist));
});

app.post('/updatecontainerid', async (req, res) => {
	const { cardTitle, conId } = req.body;

	await cards.update({ card_container_id: conId }, { where: { title: cardTitle } });

	await cards
		.findAll({
			where: { card_container_id: conId }
		})
		.then((contList) => res.json(contList));
});

app.post('/updatecardtitle', async (req, res) => {
	const { boardId, cardId, newTitle } = req.body;
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await card_containers.update({ title: newTitle }, { where: { id: cardId } });

	await card_containers
		.findAll({
			where: { board_id: boardId }
		})
		.then((cardlist) => res.json(cardlist.sort(compare)));
});

app.post('/updatecomment', async (req, res) => {
	const { id, comment } = req.body;

	await comments.update({ comment: comment }, { where: { id: id } });
	await comments.findOne({ where: { id: id } }).then((comment) => res.json(comment.comment));
});

app.post('/updateCardlist', async (req, res) => {
	const { board, draggableId, destination, source } = req.body;

	const startPoint = source.index;
	const endPoint = destination.index;
	let templist = '';
	let id = '';
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	// await boards
	// 	.findOne({
	// 		where: { title: boardname }
	// 	})
	// 	.then((board) => {
	// 		boardId = board.id;
	// 	});

	await card_containers
		.findAll({
			where: { board_id: board.id }
		})
		.then(async (containerlist) => {
			templist = containerlist.sort(compare);
			console.log(templist);
			if (startPoint < endPoint) {
				for (let i = startPoint + 1; i <= endPoint; i++) {
					id = templist[i].dataValues.id;
					console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
					console.log(id);
					await card_containers.update({ index: i - 1 }, { where: { id: id } });
				}
			} else if (startPoint > endPoint) {
				for (let i = endPoint; i < startPoint; i++) {
					id = templist[i].dataValues.id;
					console.log('!!!!!!!!!!!~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!');
					console.log(id);
					await card_containers.update({ index: i + 1 }, { where: { id: id } });
				}
			}
			await card_containers.update({ index: endPoint }, { where: { id: draggableId } });
		});

	// await card_containers
	// 	.findAll({
	// 		where: { board_id: boardId }
	// 	})
	// 	.then((containerlist) => {
	// 		res.json(containerlist.sort(compare));
	// 	});
});

app.post('/description', async (req, res) => {
	const { cardId, description } = req.body;

	await cards.update({ description: description }, { where: { id: cardId } });
	await cards.findOne({ where: { id: cardId } }).then((card) => res.json(card.description));
});

app.post('/updateCardentrylistInTwoColumn', async (req, res) => {
	const { draggableId, destination, source } = req.body;
	const movedEntryId = draggableId;
	const homeId = source.droppableId;
	const newplaceId = destination.droppableId;
	const startPoint = source.index;
	const endPoint = destination.index;
	let homelist = '';
	let newplacelist = '';
	let id = '';
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await cards
		.findAll({
			where: { card_container_id: homeId }
		})
		.then(async (cardlist) => {
			console.log('!!!!homelist zone!!!!!!');
			homelist = cardlist.sort(compare);
			for (let i = startPoint + 1; i < homelist.length; i++) {
				id = homelist[i].dataValues.id;
				await cards.update({ index: i - 1 }, { where: { id: id } });
			}
		});

	await cards
		.findAll({
			where: { card_container_id: newplaceId }
		})
		.then(async (cardlist) => {
			console.log('!!!!newplacelist zone!!!!!!');
			newplacelist = cardlist.sort(compare);
			for (let i = endPoint; i < newplacelist.length; i++) {
				id = newplacelist[i].dataValues.id;
				await cards.update({ index: i + 1 }, { where: { id: id } });
			}
		});
	await cards.update({ card_container_id: newplaceId, index: endPoint }, { where: { id: movedEntryId } });
});

app.post('/updateCardentrylistInOneColumn', async (req, res) => {
	const { draggableId, destination, source } = req.body;
	const movedEntryId = draggableId;
	const cardId = source.droppableId;
	const startPoint = source.index;
	const endPoint = destination.index;
	let entrylist = '';
	let id = '';
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await cards
		.findAll({
			where: { card_container_id: cardId }
		})
		.then(async (cardlist) => {
			entrylist = cardlist.sort(compare);
			if (startPoint > endPoint) {
				for (let i = endPoint; i < source.index; i++) {
					id = entrylist[i].dataValues.id;
					await cards.update({ index: i + 1 }, { where: { id: id } });
				}
			} else if (startPoint < endPoint) {
				for (let i = startPoint + 1; i <= endPoint; i++) {
					id = entrylist[i].dataValues.id;
					await cards.update({ index: i - 1 }, { where: { id: id } });
				}
			}

			await cards.update({ index: endPoint }, { where: { id: movedEntryId } });
		});
});

app.listen(port, function() {
	console.log(`App listening on port ${port}`);
});
