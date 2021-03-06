const { card_containers } = require('../models');

const deleteCard = async (req, res) => {
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
};

export default deleteCard;
