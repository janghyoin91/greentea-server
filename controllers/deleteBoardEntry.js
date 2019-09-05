const { users, boards } = require('../models');

const deleteBoardEntry = async (req, res) => {
	const { email, boardentryId } = req.body;
	let userId = '';

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			userId = user.id;
		});

	await boards.destroy({
		where: { id: boardentryId }
	});

	await boards
		.findAll({
			where: { user_id: userId }
		})
		.then((list) => {
			res.json(list);
		});
};

export default deleteBoardEntry;
