const ordersMiddleware = require("../Middlewares/orderMiddleware");
const productsMiddleware = require("../Middlewares/productMiddleware");
const authMiddleware = require("../util/auth");

const express = require('express');


const router = express.Router();

router.get("/api/v1/orders/:id", ordersMiddleware.orderById)
  .put("/api/v1/orders/:id", ordersMiddleware.updateOrderById )
  .delete("/api/v1/orders/:id", ordersMiddleware.deleteOrderById);
  

router.get("/api/v1/products", productsMiddleware.getProduct )
  .post("/api/v1/products", productsMiddleware.createProduct);

router.get("/api/v1/products/:id",productsMiddleware.getProductById )
  .put("/api/v1/products/:id", productsMiddleware.updateProductById)
  .delete("/api/v1/products/:id",productsMiddleware.deleteProductById);

  router.get("/api/v1/orders",authMiddleware.checkAuth , ordersMiddleware.ordersMiddleware)
  .post("/api/v1/orders",authMiddleware.checkAuth ,ordersMiddleware.createOrder );
  
  module.exports = router;
