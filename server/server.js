'use strict';

const express = require('express');
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require('express-validator');
const clientDao = require('./client-dao');
const orderDao = require('./order-dao');
const productDao = require('./product-dao');
const farmerDao = require('./farmer-dao');

// init express
const app = new express();
const port = 3001;
// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

/*TEST GET route */
app.get('/api/test', (req, res) => {
  res.json({ textsent: "backend ok!" })
})

// activate the server
module.exports = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//get all clients
app.get('/api/clients',
  async (req, res) => {
    clientDao.getClients()
      .then(client => res.json(client))
      .catch(() => res.status(500).end());
  });

//get orders given a clientid
app.get('/api/orders',
  async (req, res) => {
    orderDao.getOrders(req.query.clientid)
      .then(order => res.json(order))
      .catch(() => res.status(500).end());
  });

//update order status
//TODO manage order not existing
app.put('/api/orders/:orderid', async (req, res) => {
  try {
    await orderDao.updateOrderStatus(req.params.orderid,req.body.status);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error ${err}.` });
  }
});

//Get all available products
app.get('/api/products',
  async (req, res) => {
    productDao.getProductsAvailable()
      .then(products => res.json(products))
      .catch(()=> res.staus(500).end());
});

//Get all farmers name
app.get('/api/farmers',
  async (req, res) => {
    farmerDao.getFarmers()
      .then(farmers => res.json(farmers))
      .catch(()=> res.staus(500).end());
});