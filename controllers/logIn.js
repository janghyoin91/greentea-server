const { users } = require('../models');
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { secret } from '../config/jwt';

const logIn = async (req, res) => {
	const { email, password, name } = req.body;
	// if (name) {
	// 	console.log('saklfjlaFJfjefa!!!!!!!!!!!!!!ldksdfL');
	// 	next();
	// } else {
	if (!email || !password) {
		next();
	} else {
		users
			.findOne({
				where: { email: email }
			})
			.then((user) => {
				if (user) {
					const decipher = crypto.createDecipher('aes-256-cbc', 'Mannenidittliv');
					let decipheredPW = decipher.update(user.password, 'base64', 'utf8');
					decipheredPW += decipher.final('utf8');

					console.log('!!!!!!User :    ', user);
					console.log('유저가 입력한 비밀번호:   ', password);
					console.log('DB에 저장되어있는 비밀번호:   ', user.password);
					console.log('복호화한 비밀번호:   ', decipheredPW);

					if (password === decipheredPW) {
						let token = jwt.sign({ email: user.email, name: user.name }, secret, {
							expiresIn: 60000
						});
						res.status(200).json({
							success: true,
							err: null,
							token,
							userid: user.id,
							username: user.name
						});
					}
				} else {
					res.status(400).json('회원가입해야해');
				}
			});
		// }
	}
};

export default logIn;
