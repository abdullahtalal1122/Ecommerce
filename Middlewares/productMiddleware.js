const db = require("../models/customersModel");
 

 const getProduct = (req, res) => {
    // Retrieve all products from the database and send the response
    db.query("SELECT * FROM products", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }

  const getProductById = (req, res) => {
    const productId = req.params.id;
    // Retrieve a specific product by ID from the database and send the response
    db.query("SELECT * FROM products WHERE product_id = ?", [productId], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json(results[0]);
      }
    });
  }

  const createProduct =  (req, res) => {
    // Create a new product in the database based on the request data and send the response
    const { product_id, product_name, price, description, category } = req.body;
    const newProduct = {
      product_id,
      product_name,
      price,
      description,
      category
    };
    db.query("INSERT INTO products SET ?", newProduct, (err, results) => {
      if (err) throw err;
      res.status(201).json({ message: "Product created successfully" });
    });
  }

  const updateProductById = (req, res) => {
    const productId = req.params.id;
    // Update a specific product by ID in the database based on the request data and send the response
    const { product_name, price, description, category } = req.body;
    const updatedProduct = {
      product_name,
      price,
      description,
      category
    };
    db.query("UPDATE products SET ? WHERE product_id = ?", [updatedProduct, productId], (err, results) => {
      if (err) throw err;
      res.json({ message: "Product updated successfully" });
    });
  }
  const deleteProductById =  (req, res) => {
    const productId = req.params.id;
    // Delete a specific product by ID from the database and send the response
    db.query("DELETE FROM products WHERE product_id = ?", [productId], (err, results) => {
      if (err) throw err;
      res.json({ message: "Product deleted successfully" });
    });
  }

  exports.getProduct = getProduct;
  exports.getProductById = getProductById;
  exports.createProduct = createProduct;
  exports.updateProductById = updateProductById;
  exports.deleteProductById = deleteProductById;
  