const express = require('express');
const router = express.Router();

// Define a route for the root URL (/shop)
router.get('/', (req, res) => {
  res.send("You got all shops");
});

// Define a route for the /shop/:id URL
router.get('/:id', (req, res) => {
  // Return the shop with the given ID
});

// Define a route for handling POST requests to the /shop URL
router.post('/', (req, res) => {
  // Add a new shop to the database
});

// Define a route for handling PUT requests to the /shop/:id URL
router.put('/:id', (req, res) => {
  // Update the shop with the given ID
});

// Define a route for handling DELETE requests to the /shop/:id URL
router.delete('/:id', (req, res) => {
  // Delete the shop with the given ID
});

module.exports = router;
