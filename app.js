const bodyParser = require('body-parser');
const express = require('express');
require('./util/passport_config');
const app = express();
const port = 3000;
const cors = require('cors');



app.use(cors());

app.use(express.static('public'));

app.use(express.json());
const passport = require('passport');
const session = require('express-session');

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const sqlRouter = require("./routes/sqlRoutes");
const userRouter = require("./routes/userRoutes");
const applicationRouter = require("./routes/applicationRoutes");

  
// parsing JSON data
app.use(express.json());


app.use(sqlRouter);
app.use(userRouter);
app.use(applicationRouter);


app.listen(port , console.log(`server started at port ${port}`) );
