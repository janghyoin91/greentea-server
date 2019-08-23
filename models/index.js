const Sequelize = require('sequelize');
const { dbConfig } = require('../config');

const { database, username, password } = dbConfig;

const sequelize = new Sequelize(database, username, password, dbConfig);

const db = { sequelize, Sequelize };

db.users = require('./users')(sequelize, Sequelize);
db.boards = require('./boards')(sequelize, Sequelize);
db.card_containers = require('./card_containers')(sequelize, Sequelize);
db.cards = require('./cards')(sequelize, Sequelize);
db.comments = require('./comments')(sequelize, Sequelize);

// db.users.hasMany(db.boards, { foreignKey: 'user_id', sourceKey: 'id' });
// db.users.hasMany(db.comments, { foreignKey: 'user__id', sourceKey: 'id' });
db.boards.hasMany(db.card_containers, { foreignKey: 'board_id', sourceKey: 'id' });
db.card_containers.hasMany(db.cards, { foreignKey: 'card_container_id', sourceKey: 'id' });
db.cards.hasMany(db.comments, { foreignKey: 'card__id', sourceKey: 'id' });

module.exports = db;
