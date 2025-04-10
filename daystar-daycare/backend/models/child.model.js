const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Child = sequelize.define('Child', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 12
      }
    },
    parentName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    parentPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    parentEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    specialNeeds: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sessionType: {
      type: DataTypes.ENUM('half-day', 'full-day'),
      allowNull: false,
      defaultValue: 'full-day'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'children'
  });

  Child.associate = (models) => {
    Child.belongsTo(models.Babysitter, {
      foreignKey: 'babysitterId',
      as: 'babysitter'
    });
    Child.hasMany(models.Attendance, {
      foreignKey: 'childId',
      as: 'attendance'
    });
    Child.hasMany(models.Incident, {
      foreignKey: 'childId',
      as: 'incidents'
    });
    Child.hasMany(models.Payment, {
      foreignKey: 'childId',
      as: 'payments'
    });
  };

  return Child;
}; 