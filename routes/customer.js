const express = require('express');
const router = express.Router();
const sql = require('../db');

// Define a route for the root URL (/customer)
router.get('/test', (req, res) => {
  // sample return suppliers
  sql.query('SELECT * FROM SUPPLIERS', (error, results, fields) => {
    if(error) throw error;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: results})
  })
});

// Define a route for the /customer/:id URL
router.get('/:id', (req, res) => {
  // Return the customer with the given ID
});

// Define a route for handling POST requests to the /customer URL
router.post('/', (req, res) => {
  // Add a new customer to the database
});

// Define a route for handling PUT requests to the /customer/:id URL
router.put('/:id', (req, res) => {
  // Update the customer with the given ID
});

// Define a route for handling DELETE requests to the /customer/:id URL
router.delete('/:id', (req, res) => {
  // Delete the customer with the given ID
});

module.exports = router;
