const { cards } = require('../models');

const updateCardEntryTitle = async (req, res) => {
	const { cardId, cardentryId, newTitle } = req.body;
	await console.log(cardentryId);
	await console.log(newTitle);
	const compare = (a, b) => {
		return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
	};

	await cards.update({ title: newTitle }, { where: { id: cardentryId } });

	await cards.findAll().then((cardentrylist) => res.json(cardentrylist));
};

export default updateCardEntryTitle;
