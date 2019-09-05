const { card_containers } = require('../models');

const updateCardList = async (req, res) => {
	const { board, draggableId, destination, source } = req.body;

	const startPoint = source.index;
	const endPoint = destination.index;
	let templist = '';
	let id = '';
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

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
};

export default updateCardList;
