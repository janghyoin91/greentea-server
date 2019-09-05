const { card_containers } = require('../models');

const addCard = async (req, res) => {
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
};

export default addCard;
