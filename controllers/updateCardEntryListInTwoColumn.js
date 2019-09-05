const { cards } = require('../models');

const updateCardEntryListInTwoColumn = async (req, res) => {
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
};

export default updateCardEntryListInTwoColumn;
