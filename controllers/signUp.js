import { users } from '../models';
import crypto from 'crypto';

const signUp = async (req, res) => {
	const { email, name, password } = req.body;

	const cipher = crypto.createCipher('aes-256-cbc', 'Mannenidittliv');
	let cipheredPW = cipher.update(password, 'utf8', 'base64');
	cipheredPW += cipher.final('base64');

	await users
		.findOne({
			where: { email: email }
		})
		.then((user) => {
			if (user) {
				console.log('!!!!!!!!!!!!!!!!!!!!!email exists!!!!!!!!!!!!!!!!!!!!!!');
				res.json('User already exist');
			} else {
				users
					.create({
						name: name,
						email: email,
						password: cipheredPW
					})
					.then((newUser) => {
						console.log('User created: ', newUser);
						res.json('user created!!');
					})
					.catch((err) => console.log(err.message));
			}
		});
};

export default signUp;
