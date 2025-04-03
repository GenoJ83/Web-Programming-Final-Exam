const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Budget = sequelize.define('Budget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.ENUM(
        'salaries',
        'toys',
        'maintenance',
        'utilities',
        'supplies',
        'other'
      ),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    period: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active'
    },
    threshold: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 80.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'budgets'
  });

  Budget.associate = (models) => {
    Budget.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  // Helper method to check if budget is exceeded
  Budget.prototype.isExceeded = async function() {
    const totalExpenses = await this.getExpenses({
      where: {
        date: {
          [sequelize.Op.between]: [this.startDate, this.endDate]
        }
      }
    });
    
    const totalAmount = totalExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return totalAmount > (this.amount * (this.threshold / 100));
  };

  return Budget;
}; 