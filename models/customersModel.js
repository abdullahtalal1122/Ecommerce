
const mysql = require('mysql');
 
const db = mysql.createConnection({
  host: 'localhost',        // Database server (localhost for XAMPP)
  user: 'root',    // Replace with your database username
  password: '', // Replace with your database password
  database: 'dbshop' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});



module.exports = db;