// //customers
const express = require('express');
const customerMiddleware = require("../Middlewares/customerMiddleware");
const router = express.Router();
const authMiddleware = require("../util/auth");


  router.get("/api/v1/customers",customerMiddleware.getAllCustomer)
  .post("/api/v1/customers", customerMiddleware.newCustomer);

  router.get("/api/v1/customers/:id", customerMiddleware.getCustomerById)
  .put("/api/v1/customers/:id",customerMiddleware.updatedCustomerById )
  .delete("/api/v1/customers/:id", customerMiddleware.deleteCustomerById);

module.exports = router;
