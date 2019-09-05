const { users, borads } = require('../models');

const updateBoardEntryTitle = async (req, res) => {
	const { email, boardentryId, title } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.update({ title: title }, { where: { id: boardentryId } });

	await boards.findAll({ where: { id: userId } }).then((list) => res.json(list));
};
