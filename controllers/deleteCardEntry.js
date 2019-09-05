const { cards } = require('../models');

const deleteCardEntry = async (req, res) => {
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
};

export default deleteCardEntry;
