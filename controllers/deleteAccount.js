const { users, boards } = require('../models');

const deleteAccount = async (req, res) => {
	console.log('/removeaccount 탈퇴할꼬!!!!!!');
	const { email } = req.body;
	let userid = '';
	let boardidarr = [];
	await users.findOne({ where: { email: email } }).then((user) => {
		userid = user.id;
	});

	await users.destroy({
		where: { id: userid }
	});
	await boards
		.findAll({
			where: { user_id: userid }
		})
		.then((result) => {
			result.forEach((item) => boardidarr.push(item.id));
		});
	await boardidarr.forEach((item) =>
		boards.destroy({
			where: { id: item }
		})
	);
};

export default deleteAccount;
