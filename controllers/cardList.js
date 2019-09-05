const { card_containers } = require('../models');

const cardList = async (req, res) => {
	console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
	console.log(req.headers);
	const { boardId } = req.body;

	await card_containers.findAll({ where: { board_id: boardId } }).then((cardlist) => {
		res.json(cardlist);
	});
};

export default cardList;
