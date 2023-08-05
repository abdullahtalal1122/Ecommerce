
const bcrypt = require('bcrypt');
const db = require("../models/customersModel");
const newCustomer =  (req, res) => {
    const { customer_id, username, password, first_name, last_name, email, address, city, state, country, postal_code } = req.body;
  
    // Check if the username is already taken
    db.query('SELECT * FROM customers WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
  
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        // Insert the user into the database
        db.query(
          'INSERT INTO customers ( username, password, first_name, last_name,email, address, city, state, country, postal_code) VALUES (?, ?, ?, ?, ? , ? , ? ,?,?,?)',
          [ username, hashedPassword, first_name, last_name,email, address, city, state, country, postal_code],
          (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'User registered successfully' });
          }
        );
      });
    });
  }
  const getAllCustomer =  (req, res) => {
    // Retrieve all customers from the database and send the response
    db.query("SELECT * FROM customers", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }

  const getCustomerById =  (req, res) => {
    const customerId = req.params.id;
    // Retrieve a specific customer by ID from the database and send the response
    db.query("SELECT * FROM customers WHERE customer_id = ?", [customerId], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(404).json({ message: "Customer not found" });
      } else {
        res.json(results[0]);
      }
    });
  }

  
  const updatedCustomerById = (req, res) => {
    const customerId = req.params.id;
    // Update a specific customer by ID in the database based on the request data and send the response
    const { first_name, last_name, email, address, city, state, country, postal_code } = req.body;
    const updatedCustomer = {
      first_name,
      last_name,
      email,
      address,
      city,
      state,
      country,
      postal_code
    };
    db.query("UPDATE customers SET ? WHERE customer_id = ?", [updatedCustomer, customerId], (err, results) => {
      if (err) throw err;
      res.json({ message: "Customer updated successfully" });
    });
  }

const deleteCustomerById =    (req, res) => {
const customerId = req.params.id;
// Delete a specific customer by ID from the database and send the response
db.query("DELETE FROM customers WHERE customer_id = ?", [customerId], (err, results) => {
  if (err) throw err;
  res.json({ message: "Customer deleted successfully" });
});
} 

  exports.newCustomer = newCustomer;
  exports.getAllCustomer = getAllCustomer;
  exports.getCustomerById = getCustomerById ;
  exports.deleteCustomerById = deleteCustomerById
  exports.updatedCustomerById = updatedCustomerById ;