module.exports = (sequelize, DataTypes) => {
	const cards = sequelize.define(
		'cards',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			card_container_id: {
				type: DataTypes.INTEGER
			},
			title: {
				type: DataTypes.STRING
			},
			description: {
				type: DataTypes.STRING
			},
			due_date: {
				type: DataTypes.DATE
			},
			index: {
				type: DataTypes.INTEGER
			}
		},
		{
			timestamps: false
		}
	);

	return cards;
};
