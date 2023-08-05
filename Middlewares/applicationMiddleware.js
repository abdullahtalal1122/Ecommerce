const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models/customersModel');

const home = (req, res) => {


  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    console.log(results);
    res.render('index', { products: results });    
  });
  }

// const getitemsInOrder = (req,res,next) => {

//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       // Authentication failed
//       return res.status(401).json({ message: 'Please Login ' });
//     }
  
//   }


// };
  
const getLogin = (req , res) => {
  res.render("login");
}



const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Authentication failed
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      // Retrieve the hashed password from the database
      const hashedPassword = user.password;
      // Compare the provided password with the hashed password
      bcrypt.compare(req.body.password, hashedPassword, (err, isMatch) => {
        if (err) {
          return next(err);
        }
        if (!isMatch) {
          // Passwords don't match, authentication failed
          return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Authentication successful, log in the user
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Redirect or send a response indicating successful login
          return res.status(200).json({ message: 'Login successful'});
        });
      });
    })(req, res, next);
  };  

exports.home = home ; 
exports.login = login ; 
exports.getLogin = getLogin;