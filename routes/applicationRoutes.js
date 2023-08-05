const express = require('express');
const router = express.Router();
const applicationMiddleware = require("../Middlewares/applicationMiddleware");
const authMiddleware = require("../util/auth");


  router.get('/' ,  applicationMiddleware.home);
  
  router.post('/login', applicationMiddleware.login ).get('/login' , applicationMiddleware.getLogin);

module.exports = router;
