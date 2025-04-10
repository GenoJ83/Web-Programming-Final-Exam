const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'early_departure'),
      defaultValue: 'present'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sessionType: {
      type: DataTypes.ENUM('half-day', 'full-day'),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'attendance'
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Babysitter, {
      foreignKey: 'babysitterId',
      as: 'babysitter'
    });
    Attendance.belongsTo(models.Child, {
      foreignKey: 'childId',
      as: 'child'
    });
  };

  // Helper method to calculate duration in hours
  Attendance.prototype.calculateDuration = function() {
    if (!this.checkOut) return null;
    const duration = this.checkOut - this.checkIn;
    return Math.round((duration / (1000 * 60 * 60)) * 100) / 100;
  };

  return Attendance;
}; 