const { cards } = require('../models');

const cardEntryList = async (req, res) => {
	await cards.findAll().then((cardentrylist) => {
		res.json(cardentrylist);
	});
};

export default cardEntryList;
