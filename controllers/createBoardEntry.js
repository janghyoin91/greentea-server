const { users, boards } = require('../models');

const createBoardEntry = async (req, res) => {
	const { email, title } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.create({
		user_id: userId,
		title: title
	});

	await boards
		.findAll({
			where: { user_id: userId }
		})
		.then((boardlist) => {
			res.json(boardlist);
		});
};

export default createBoardEntry;
