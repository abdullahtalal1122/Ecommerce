const db = require("../models/customersModel");
const { v4: uuidv4 } = require('uuid');

const ordersMiddleware = (req, res) => {
  
    const customerId = req.user.customer_id; // Assuming the user ID is stored in req.user._id
    console.log(customerId);
    const query = `
      SELECT o.order_id, o.order_date, o.total_amount, oi.order_item_id, oi.quantity, oi.price, p.product_name
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_id = ?
    `;
  
    db.query(query, [customerId], (err, results) => {
      if (err) {
        // Handle the error
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving orders and order items.' });
      } else {
        {
          console.log(results);
         // Define the orders variable outside the query callback
        const orders = {};


  results.forEach((row) => {
    const orderId = row.order_id;

    if (!orders[orderId]) {
      orders[orderId] = {
        order_id: orderId,
        order_date: row.order_date,
        total_amount: 0, // Initialize total amount to 0
        order_items: [],
      };
    }

    const orderItem = {
      order_item_id: row.order_item_id,
      product_name: row.product_name,
      quantity: row.quantity,
      price: row.price,
    };

    orders[orderId].order_items.push(orderItem);
    orders[orderId].total_amount += row.price * row.quantity; // Calculate the total amount
  });

  const formattedResponse = Object.values(orders);

  res.json(formattedResponse);
          }
        }
    });
  
  }



const orderById =  (req, res) => {
    const orderId = req.params.id;
    // Retrieve a specific order by ID from the database and send the response
    db.query("SELECT * FROM orders WHERE order_id = ?", [orderId], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.json(results[0]);
      }
    });
  }


//UNDER CONSTRUCTION



const createOrder = (req, res) => {
  const { product_id, quantity } = req.body;
  const customer_id = req.user.customer_id;
  const order_date = new Date().toLocaleDateString();

  db.query("SELECT * FROM orders WHERE customer_id = ? AND status = 'active'", [customer_id], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const existingOrder = results[0]; 

      const order_id = existingOrder.order_id;
      let order_item_id = uuidv4();

      // Generate a unique order_item_id
      const checkOrderItem = () => {
        const checkQuery = "SELECT * FROM order_items WHERE order_item_id = ?";
        const checkValues = [order_item_id];

        db.query(checkQuery, checkValues, (err, checkResult) => {
          if (err) throw err;

          if (checkResult.length === 0) {
            const newOrderItem = {
              order_item_id,
              order_id,
              product_id,
              quantity
            };

            db.query("INSERT INTO order_items SET ?", newOrderItem, (err, results) => {
              if (err) throw err;

              res.status(201).json({ message: "Item added to existing order" });
            });
          } else {
            order_item_id = uuidv4(); 
            checkOrderItem(); // Retry the check
          }
        });
      };

      checkOrderItem();
    } else {
      // If no active order exists, create a new order as before
      const order_id = uuidv4();
      let order_item_id = uuidv4();

      // Generate a unique order_item_id
      const checkOrderItem = () => {
        const checkQuery = "SELECT * FROM order_items WHERE order_item_id = ?";
        const checkValues = [order_item_id];

        db.query(checkQuery, checkValues, (err, checkResult) => {
          if (err) throw err;

          if (checkResult.length === 0) {
            const newOrder = {
              order_id,
              customer_id,
              order_date,
              status: 'active',
              order_date: new Date() 
            };

            const newOrderItem = {
              order_item_id,
              order_id,
              product_id,
              quantity
            };

            db.query("INSERT INTO orders SET ?", newOrder, (err, results) => {
              if (err) throw err;

              db.query("INSERT INTO order_items SET ?", newOrderItem, (err, results) => {
                if (err) throw err;

                res.status(201).json({ message: "New order created with item" });
              });
            });
          } else {
            order_item_id = uuidv4(); // Generate a new order_item_id and retry
            checkOrderItem(); // Retry the check
          }
        });
      };

      checkOrderItem();
    }
  });
};


  
  const updateOrderById = (req, res) => {
    const orderId = req.params.id;
    // Update a specific order by ID in the database based on the request data and send the response
    const { customer_id, order_date, total_amount } = req.body;
    const updatedOrder = {
      customer_id,
      order_date,
      total_amount
    };
    db.query("UPDATE orders SET ? WHERE order_id = ?", [updatedOrder, orderId], (err, results) => {
      if (err) throw err;
      res.json({ message: "Order updated successfully" });
    });
  }

  const deleteOrderById =  (req, res) => {
    const orderId = req.params.id;
    // Delete a specific order by ID from the database and send the response
    db.query("DELETE FROM orders WHERE order_id = ?", [orderId], (err, results) => {
      if (err) throw err;
      res.json({ message: "Order deleted successfully" });
    });
  }

  exports.deleteOrderById = deleteOrderById 
  exports.updateOrderById = updateOrderById
  exports.createOrder = createOrder
  exports.orderById = orderById
  exports.ordersMiddleware = ordersMiddleware