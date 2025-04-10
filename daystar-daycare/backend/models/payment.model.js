const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    paymentType: {
      type: DataTypes.ENUM('parent', 'babysitter'),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'mobile_money', 'bank_transfer'),
      allowNull: false
    },
    sessionType: {
      type: DataTypes.ENUM('half-day', 'full-day'),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    timestamps: true,
    tableName: 'payments'
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Child, {
      foreignKey: 'childId',
      as: 'child'
    });
    Payment.belongsTo(models.Babysitter, {
      foreignKey: 'babysitterId',
      as: 'babysitter'
    });
  };

  // Calculate babysitter payment based on number of children and session type
  Payment.calculateBabysitterPayment = (numChildren, sessionType) => {
    const ratePerChild = sessionType === 'half-day' ? 2000 : 5000;
    return numChildren * ratePerChild;
  };

  return Payment;
}; 