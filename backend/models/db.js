const mysql = require('mysql2')
require('dotenv').config()


const connection = mysql.createConnection({
    host:'localhost',
    user:process.env.DB_USER,
    password: process.env.MARIADBPASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MariaDB: ', err);
      return;
    }
    console.log('Connected to the MariaDB database.');
  });





module.exports = connection