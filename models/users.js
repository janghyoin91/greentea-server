module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define(
		'users',
		{
			id: {
				type: DataTypes.INTEGER(11),
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING
			},
			email: {
				type: DataTypes.STRING
			},
			password: {
				type: DataTypes.STRING
			}
		},
		{
			timestamps: false
		}
	);

	return users;
};
