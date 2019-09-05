const { cards } = require('../models');

const updateCardEntryListInOneColumn = async (req, res) => {
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
};

export default updateCardEntryListInOneColumn;
