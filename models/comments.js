module.exports = (sequelize, DataTypes) => {
	const comments = sequelize.define(
		'comments',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			user__id: {
				type: DataTypes.INTEGER
			},
			card__id: {
				type: DataTypes.INTEGER
			},
			comment: {
				type: DataTypes.STRING
			}
		},
		{
			timestamps: false
		}
	);

	return comments;
};
