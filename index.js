const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// route imports
const customerRouter = require('./routes/customer');
const shopRouter = require('./routes/shop');

// Allow cross origin requests from frontend application
app.use(cors())

// Check if the server is up and running
app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

// middlewares
app.use('/customer', customerRouter);
app.use('/shop', shopRouter);

/**
 * Always place the 404 handler at the bottom of all the middlewares
 */
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

// start the server and listen at specified port number
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})