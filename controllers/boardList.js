const { users, boards } = require('../models');

const boardList = async (req, res) => {
	console.log('/boardlist 라우터까지 들어왔음!!!!!!');
	const { email } = req.body;
	let id = '';
	console.log('*****************************8');
	await users.findOne({ where: { email: email } }).then((user) => {
		id = user.id;
		console.log('@@@@@@@userid = ');
	});
	await boards
		.findAll({
			where: { user_id: id }
		})
		.then((result) => {
			console.log('result 응답해주는데까지 왔음~!');
			console.log(result);
			res.json(result);
		});
};

export default boardList;
