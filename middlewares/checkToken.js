import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt';

const checkToken = (req, res, next) => {
	let token = req.headers['authorization'];
	console.log(token);

	if (token) {
		console.log('토큰존재하는곳');
		console.log(token);
		jwt.verify(token, secret, function(err, decode) {
			if (err) {
				return res.status(401).json({
					success: false,
					message: 'Token is not valid'
				});
			} else if (decode) {
				console.log('decode=true');
				next();
			}
		});
	} else {
		console.log('토큰존재하지않는곳');
		return res.status(401).json({
			success: false,
			message: 'Token does not exist!'
		});
	}
};

export default checkToken;
