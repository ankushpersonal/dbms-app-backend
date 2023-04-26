const express = require('express');
const router = express.Router();
const sql = require('../db');

/**
 * Add a manager to the database
 * @route POST /shop/signup
 * @param {object} req.body - Object containing customer details
 * @returns {object} Object containing success message
 * @throws {Error} Throws error if database query fails
*/
router.post('/signup', async (req, res) => {
  try {
    const { location_id, ssn, employee_name, email_address, pwd, employee_role, start_date } = req.body;
    const statement = `
      INSERT INTO employee (location_id, ssn, employee_name, email_address, pwd, employee_role, start_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [location_id, ssn, employee_name, email_address, pwd, employee_role, start_date];
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
    const [rows] = await sql.promise().query('SELECT * FROM employee WHERE email_address = ? AND pwd = ?', [email, password]);
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


router.get('/parts/:locationId', async (req, res, next) => {
  try {
    const locationId = req.params.locationId;
    const statement = `
      SELECT part.part_id, part.part_price, part.part_name
      FROM part, part_shop_inventory
      WHERE part.part_id = part_shop_inventory.part_id
      AND part_shop_inventory.location_id = ?;
    `;
    const [results] = await sql.promise().query(statement, [locationId]);
    res.status(200).json({ data: results });
  } catch (err) {
    next(err);
  }
});


router.get('/appointments/:locationId', async (req, res, next) => {
  try {
    const locationId = req.params.locationId;
    const statement = `
      SELECT * from appointment where location_id = ?;
    `;
    const [results] = await sql.promise().query(statement, [locationId]);
    res.status(200).json({ data: results });
  } catch (err) {
    next(err);
  }
});


// update part price
router.put('/parts', async (req, res) => {
  try {
    const { partData,  price} = req.body;
    const statement = `
    UPDATE part
    SET part_price = ${price}
    WHERE part_id = ${partData};
    `;
    const [result] = await sql.promise().query(statement);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: result, message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
});


// update service price
router.put('/services', async (req, res) => {
  try {
    const { service_type, vehicle_type,  price} = req.body;

    const statement = `
    UPDATE service
    SET price = ${price}
    WHERE service_type = "${service_type}" AND vehicle_type = "${vehicle_type}"
    `;
    console.log(statement);
    const [result] = await sql.promise().query(statement);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: result, message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
});

router.put('/appointments/:id', async (req, res) => {
  console.log(req.body, "sdsdsdsdsdsdsdssdsd");
  try {
    const { id } = req.params;
    const { status, start_time, end_time } = req.body;
    
    console.log(status, start_time, end_time , id, "++++++++++++++++++");
    let statement = 'UPDATE appointment SET ';
    const values = [];
    
    if (status) {
      statement += 'status = ?, ';
      values.push(status);
    }
    
    if (start_time) {
      statement += 'start_time = ?, ';
      values.push(start_time);
    }
    
    if (end_time) {
      statement += 'end_time = ?, ';
      values.push(end_time);
    }
    
    statement = statement.slice(0, -2); // Remove trailing comma and space
    statement += ' WHERE appointment_id = ?;';
    values.push(id);
    
    console.log(statement, "statement", values);
    const [result] = await sql.promise().query(statement, values);
    console.log(result, "result");
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data: result, message: 'Appointment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});


module.exports = router;
