const mysql = require('mysql2/promise');

async function createTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.MARIADBPASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Create babysitters table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS babysitters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        phoneNumber VARCHAR(20) NOT NULL,
        nin VARCHAR(20) NOT NULL,
        age INT NOT NULL,
        nextOfKinName VARCHAR(100) NOT NULL,
        nextOfKinPhone VARCHAR(20) NOT NULL,
        hourlyRate DECIMAL(10,2) NOT NULL,
        experience INT,
        qualifications TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Update children table
    await connection.execute(`
      ALTER TABLE children 
      ADD COLUMN IF NOT EXISTS sessionType ENUM('half-day', 'full-day') NOT NULL DEFAULT 'full-day',
      ADD COLUMN IF NOT EXISTS attendanceStatus ENUM('present', 'absent') DEFAULT 'absent',
      ADD COLUMN IF NOT EXISTS assignedBabysitterId INT,
      ADD FOREIGN KEY IF NOT EXISTS (assignedBabysitterId) REFERENCES babysitters(id)
    `);

    // Create attendance table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        childId INT NOT NULL,
        babysitterId INT NOT NULL,
        date DATE NOT NULL,
        sessionType ENUM('half-day', 'full-day') NOT NULL,
        checkInTime TIME,
        checkOutTime TIME,
        status ENUM('present', 'absent') DEFAULT 'absent',
        FOREIGN KEY (childId) REFERENCES children(id),
        FOREIGN KEY (babysitterId) REFERENCES babysitters(id)
      )
    `);

    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        babysitterId INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        sessionType ENUM('half-day', 'full-day') NOT NULL,
        numberOfChildren INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
        FOREIGN KEY (babysitterId) REFERENCES babysitters(id)
      )
    `);

    // Create incidents table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        childId INT NOT NULL,
        babysitterId INT NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('low', 'medium', 'high') NOT NULL,
        actionTaken TEXT,
        date DATETIME NOT NULL,
        status ENUM('open', 'resolved') DEFAULT 'open',
        FOREIGN KEY (childId) REFERENCES children(id),
        FOREIGN KEY (babysitterId) REFERENCES babysitters(id)
      )
    `);

    // Create budgets table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        period ENUM('weekly', 'monthly') NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active'
      )
    `);

    // Create expenses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        budgetId INT,
        FOREIGN KEY (budgetId) REFERENCES budgets(id)
      )
    `);

    // Create notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        type ENUM('payment', 'incident', 'attendance', 'system') NOT NULL,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read') DEFAULT 'unread',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    console.log('Database tables created/updated successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { createTables }; 