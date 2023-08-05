const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models/customersModel');

passport.use(
  new LocalStrategy((username, password, done) => {
    db.query(
      'SELECT * FROM customers WHERE username = ?',
      [username],
      (err, results) => {
        if (err) return done(err);
        if (!results.length) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, user.customer_id);
});

passport.deserializeUser((customer_id, done) => {
  db.query('SELECT * FROM customers WHERE customer_id = ?', [customer_id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});
