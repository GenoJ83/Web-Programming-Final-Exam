const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost', // Change if using a different database host
    user: 'root', // Change to your MySQL username
    password: '', // Change to your MySQL password
    database: 'DaystarDaycareDB'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the DaystarDaycareDB database');
});

module.exports = connection;
