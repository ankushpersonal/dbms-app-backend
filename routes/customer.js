const express = require('express');
const router = express.Router();
const sql = require('../db');

/**
 * Get all customers from database
 * @route GET /customer/getAllCustomers
 * @returns {object} Object containing an array of all customers
 * @throws {Error} Throws error if database query fails
*/
router.get('/getAllCustomers', async (req, res) => {
  try {
    const results = await sql.promise().query('SELECT * FROM customer');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a customer to the database
 * @route POST /customer/signup
 * @param {object} req.body - Object containing customer details
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails
*/
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, telephoneNumber, ccNumber, apartment, street, city, state, zipCode } = req.body;
    const statement = `
      INSERT INTO customer (first_name, last_name, email_address, pwd, telephone_number, credit_card_no, apt, street, city, state, zip_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, email, password, telephoneNumber, ccNumber , apartment, street, city, state, zipCode];
    const [result] = await sql.promise().query(statement, values);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: result[0], message: 'Customer added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add customer', error: error.message });
  }
});

/**
 * Authenticate user by checking user's email and password
 * @route GET /customer/login
 * @param {object} req.body - User email and password
 * @returns {object} Object containing user details if authentication is successful
 * @throws {Error} Throws error if database query fails
*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await sql.promise().query('SELECT * FROM customer WHERE email_address = ? AND pwd = ?', [email, password]);
    if (rows.length > 0) {
      res.status(200).json({ data: rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
})

// *********Edit customer registration should implement

/**
 * Add a new vehicle to the database
 * @route POST /customer/addVehicle
 * @param {object} object containing vehicle details
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails
 */
router.post('/addVehicle', async (req, res) => {
  try {
    const { vehicle_registration, customerId, model, manufacturer, color, type, year } = req.body;
    const statement = `
      INSERT INTO vehicle (vehicle_registration, customer_id, model, manufacturer, color, type, year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [vehicle_registration, customerId, model, manufacturer, color, type, year];
    const [result] = await sql.promise().query(statement, values);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({message: 'Vehicle added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add vehicle', error: error.message });
  }
});

/**
 * Retrieve vehicles for a specific customer
 * @route GET /vehicles/:customerId
 * @param {number} customerId - The ID of the customer
 * @returns {object} - An object containing an array of vehicles for the specified customer
 * @throws {Error} - Throws an error if the database query fails
 */
router.get('/vehicles/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const statement = `
      SELECT * FROM vehicle WHERE customer_id = ${customerId}
    `;
    const results = await sql.promise().query(statement);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a vehicle in the database based on vehicle registration and customer id
 * @route PUT /vehicle/updateVehicle
 * @param {object} req.body - Object containing the updated vehicle details and customer id and vehicle registration number to identify the vehicle
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails
*/
router.put('/updateVehicle', async (req, res) => {
  console.log(req.body, "------------------");
  try {
    const { customerId, vehicle_registration, model, manufacturer, color, type, year } = req.body;
    const statement = `
      UPDATE vehicle 
      SET model=?, manufacturer=?, color=?, type=?, year=?
      WHERE customer_id=? AND vehicle_registration=?
    `;
    const values = [model, manufacturer, color, type, year, customerId, vehicle_registration];
    const [result] = await sql.promise().query(statement, values);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: result, message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
});

router.put('/updateProfile', async (req, res) => {
  try {
    const { first_name, last_name, email_address, apt,  street, city, telephone_number, credit_card_no, pwd, zip_code , state, customer_id} = req.body;
    const statement = `
      UPDATE customer 
      SET first_name =?, last_name=?, email_address=?, apt=?, street=?, city=?, telephone_number=?, credit_card_no=?, pwd=?, zip_code=?, state=?
      WHERE customer_id=?
    `;
    const values = [first_name, last_name, email_address, apt,  street, city, telephone_number, credit_card_no, pwd, zip_code , state, customer_id];
    const [result] = await sql.promise().query(statement, values);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: result, message: 'Customer updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update Customer', error: error.message });
  }
});

/**
 * Delete a vehicle of a customer
 * @route DELETE /vehicle/:vehicleRegistration
 * @param {string} vehicleRegistration - Vehicle registration number
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails or vehicle does not exist
 */
router.delete('/vehicle/:vehicleRegistration', async (req, res) => {
  try {
    const { vehicleRegistration } = req.params;
    const statement = `
      DELETE FROM vehicle
      WHERE vehicle_registration = ?
    `;
    const [result] = await sql.promise().query(statement, vehicleRegistration);
    if(result.affectedRows === 0) {
      throw new Error('Vehicle does not exist');
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete vehicle', error: error.message });
  }
});
/**
 * Get all services from database
 * @route GET /service/getAllServices
 * @returns {object} Object containing services data
 * @throws {Error} Throws error if database query fails
*/
router.get('/getAllServices', async (req, res) => {
  try {
    const results = await sql.promise().query('SELECT * FROM service');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a new appointment to the database
 * @route POST /scheduleAppointment
 * @param {object} req.body - Object containing details of the new appointment
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails
 */
router.post('/scheduleAppointment', async (req, res) => {
  try {
    // total request body
    const { customer_id, location_id, vehicle_registration, start_time, end_time, appointment_date, status, serviceType, vehicle_type} = req.body;
    // Insert to appointments table
    const statement = `
      INSERT INTO appointment (customer_id, location_id, vehicle_registration, start_time, end_time, appointment_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [customer_id, location_id, vehicle_registration, start_time, end_time, appointment_date, status];
    const [result] = await sql.promise().query(statement, values);
    // Appointments table result
    const appointmentId = result.insertId;
    const invoiceID = await invoiceInsert();
    const service_appointment_invoice_data = await service_appointment_invoice(appointmentId, invoiceID, serviceType, vehicle_type);
    console.log(service_appointment_invoice_data, "service_appointment_invoice_data - DONE");
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: {appointmentId: appointmentId}, message: 'Appointment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add appointment', error: error.message });
  }
});

async function invoiceInsert() {
      const statement = `
      INSERT INTO invoice (payment_status)
      VALUES (
      'ON HOLD'
      )`;
      const [result] = await sql.promise().query(statement);
      return result.insertId;
}

async function service_appointment_invoice( appointmentId, invoiceID, serviceTypes, vehicle_type) {
  const laborArray = [];
  const priceArray = [];
  for (const service of serviceTypes) {
    const laborQuery = `SELECT labor FROM service WHERE service_type = '${service}' AND vehicle_type = '${vehicle_type}'`;
    const priceQuery = `SELECT price FROM service WHERE service_type = '${service}' AND vehicle_type = '${vehicle_type}'`;
    const [laborResult] = await sql.promise().query(laborQuery);
    const [priceResult] = await sql.promise().query(priceQuery);
    laborArray.push(laborResult[0].labor);
    priceArray.push(priceResult[0].price);
  }
  console.log(laborArray, priceArray, "laborArray, priceArray");
  for (let i = 0; i < serviceTypes.length; i++) {
    const serviceType = serviceTypes[i];
    const labor = laborArray[i];
    const price = priceArray[i];
    const statement = `
      INSERT INTO service_appointment_invoice (appointment_id, invoice_id, service_type, vehicle_type, labor, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [appointmentId, invoiceID, serviceType, vehicle_type, labor, price];
    await sql.promise().query(statement, values);
  }
  const total = laborArray.reduce((acc, curr, index) => {
    return acc + parseFloat(curr) + parseFloat(priceArray[index]);
  }, 0);
  const finalPrice = total.toFixed(2);
  const invoiceTotalPrice = `
      UPDATE invoice
      SET total_price = ${finalPrice}
      WHERE invoice_id = ?
    `;
    const values = [invoiceID];
    const [result] = await sql.promise().query(invoiceTotalPrice, values);
    console.log('invoice insert data', result);
    console.log('Service appointment invoices inserted successfully.');
  return true;
}

router.delete('/appointment/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const statement = `
      DELETE FROM appointment
      WHERE appointment_id = ?
    `;
    const [result] = await sql.promise().query(statement, appointmentId);
    if(result.affectedRows === 0) {
      throw new Error('appointment does not exist');
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
  }
});


router.get('/viewAllServices', async (req, res) => {
  try {
    const results = await sql.promise().query('SELECT * FROM service');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/viewAllShopLocations', async (req, res) => {
  try {
    const results = await sql.promise().query('SELECT * FROM shop');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/appointments/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const statement = `
      SELECT * FROM appointment WHERE customer_id = ${customerId}
    `;
    const results = await sql.promise().query(statement);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Middleware function that handles 404 errors by sending a response with a "Not Found" message.
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function in the stack
 * @returns {undefined}
*/
router.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

module.exports = router;
