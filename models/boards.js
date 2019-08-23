module.exports = (sequelize, DataTypes) => {
	const boards = sequelize.define(
		'boards',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			user_id: {
				type: DataTypes.INTEGER
			},
			title: {
				type: DataTypes.STRING
			},
			background: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{
			timestamps: false
		}
	);

	return boards;
};
