const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'daystar_daycare',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const models = {
  User: require('./user.model')(sequelize),
  Babysitter: require('./babysitter.model')(sequelize),
  Child: require('./child.model')(sequelize),
  Payment: require('./payment.model')(sequelize),
  Attendance: require('./attendance.model')(sequelize),
  Incident: require('./incident.model')(sequelize),
  Expense: require('./expense.model')(sequelize),
  Budget: require('./budget.model')(sequelize)
};

// Define relationships between models
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
}; 