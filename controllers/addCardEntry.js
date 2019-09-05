const { cards } = require('../models');

const addCardEntry = async (req, res) => {
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
};

export default addCardEntry;
