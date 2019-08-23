module.exports = (sequelize, DataTypes) => {
	const card_containers = sequelize.define(
		'card_containers',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			board_id: {
				type: DataTypes.INTEGER
			},
			title: {
				type: DataTypes.STRING
			},
			index: {
				type: DataTypes.INTEGER
			}
		},
		{
			timestamps: false
		}
	);

	return card_containers;
};
