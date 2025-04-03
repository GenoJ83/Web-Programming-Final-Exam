const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Babysitter = sequelize.define('Babysitter', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    nin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 21,
        max: 35
      }
    },
    nextOfKinName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    nextOfKinPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'babysitters'
  });

  Babysitter.associate = (models) => {
    Babysitter.hasMany(models.Child, {
      foreignKey: 'babysitterId',
      as: 'children'
    });
    Babysitter.hasMany(models.Payment, {
      foreignKey: 'babysitterId',
      as: 'payments'
    });
    Babysitter.hasMany(models.Attendance, {
      foreignKey: 'babysitterId',
      as: 'attendance'
    });
  };

  return Babysitter;
}; 