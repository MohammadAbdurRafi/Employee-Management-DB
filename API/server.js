const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Pool, Client } = require('pg');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExtension(file.mimetype)}`);
  },
});

const getExtension = (mimeType) => {
  switch (mimeType) {
    case 'image/png':
      return '.png';
    case 'image/jpeg':
      return '.jpeg';
    case 'image/jpg':
      return '.jpg';
  }
};

const app = express();
const multerMiddleware = multer({ storage: storage });
app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use('/images', express.static('images'));

const port = process.env.PORT;

let db_hostname;
let db_username;
let db_database;
let db_password;
let db_port;
let db_ssl;

if (process.env.NODE_ENV === 'development') {
  db_hostname = process.env.LOCALDB_HOST;
  db_username = process.env.LOCALDB_USER;
  db_database = process.env.LOCALDB_DATABASE;
  db_password = process.env.LOCALDB_PASSWORD;
  db_port = process.env.LOCALDB_PORT;
  db_ssl = false;
} else {
  db_hostname = process.env.PRODDB_HOST;
  db_username = process.env.PRODDB_USER;
  db_database = process.env.PRODDB_DATABASE;
  db_password = process.env.PRODDB_PASSWORD;
  db_port = process.env.PRODDB_PORT;
  db_ssl = true;
}

const pool = new Pool({
  user: db_username,
  host: db_hostname,
  database: db_database,
  password: db_password,
  port: db_port,
  ssl: db_ssl,
});

async function connectToDB() {
  try {
    const client = new Client({
      user: db_username,
      host: db_hostname,
      database: db_database,
      password: db_password,
      port: db_port,
      ssl: db_ssl,
    });

    await client.connect();

    const dbRowCount = (await client.query('SELECT NOW()')).rowCount;

    if (dbRowCount > 0) {
      console.log(`Database successfully connected to the server`);
    } else {
      console.log(`Unable to connect database to the server`);
    }

    await client.end();
  } catch (error) {
    console.log(
      `An error occured while connecting to the database. Please see the following: ${error}`
    );
  }
}

connectToDB();

/**
 * GET: Read all designations
 * http://localhost:4000/api/designations
 */
app.get('/api/designations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM designations;');
    if (result.rowCount > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No designations found!' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * GET: Read a specific designation
 * http://localhost:4000/api/designations/:designation_id
 */
app.get('/api/designations/:designation_id', async (req, res) => {
  try {
    const designation_id = req.params.designation_id;
    const result = await pool.query(
      'SELECT * FROM designations WHERE designation_id = $1;',
      [designation_id]
    );
    if (result.rowCount > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'Selected designation was not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * POST: Create a designation
 * http://localhost:4000/api/designations
 */
app.post('/api/designations', async (req, res) => {
  try {
    console.log(req.body);
    const { designation_name, designation_description } = req.body;
    const result = await pool.query(
      'INSERT INTO designations (designation_name, designation_description) VALUES ($1, $2) RETURNING designation_id;',
      [designation_name, designation_description]
    );
    res.status(201).json({ designation_id: result.rows[0].designation_id });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * PUT: Update a designation
 * http://localhost:4000/api/designations/:designation_id
 */
app.put('/api/designations/:designation_id', async (req, res) => {
  try {
    const designation_id = req.params.designation_id;
    const { designation_name, designation_description } = req.body;
    const result = await pool.query(
      'UPDATE designations SET designation_name = $1, designation_description = $2 WHERE designation_id = $3;',
      [designation_name, designation_description, designation_id]
    );
    res.status(200).json({ message: 'Designation updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * DELETE: Delete a designation
 * http://localhost:4000/api/designations/:designation_id
 */
app.delete('/api/designations/:designation_id', async (req, res) => {
  try {
    const designation_id = req.params.designation_id;
    await pool.query('DELETE FROM designations WHERE designation_id = $1;', [
      designation_id,
    ]);
    res.status(200).json({ message: 'Designation deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * GET: Read all employees
 * http://localhost:4000/api/employees
 */
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees;');
    if (result.rowCount > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No employees found!' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * GET: Read a specific employee
 * http://localhost:4000/api/employees/:employee_id
 */
app.get('/api/employees/:employee_id', async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const result = await pool.query(
      'SELECT * FROM employees where employee_id = $1;',
      [employee_id]
    );
    if (result.rowCount > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Selected employee was not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/**
 * POST: Create an employee
 * http://localhost:4000/api/employees
 */
app.post(
  '/api/employees',
  multerMiddleware.single('employee_image'),
  async (req, res) => {
    try {
      const {
        designation_id,
        employee_name,
        job_title,
        salary,
        email,
        phone_number,
        home_address,
      } = req.body;
      console.log(req.body);
      const result = await pool.query(
        'INSERT INTO employees (designation_id, employee_name, job_title, salary, employee_image, email, phone_number, home_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning employee_id;',
        [
          designation_id,
          employee_name,
          job_title,
          salary,
          req.file.path.replace('\\', '/'),
          email,
          phone_number,
          home_address,
        ]
      );
      res.status(201).json({ employee_id: result.rows[0].employee_id });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

/**
 * PUT: Update an existing employee
 * http://localhost:4000/api/employees/:employee_id
 */
app.put(
  '/api/employees/:employee_id',
  multerMiddleware.single('employee_image'),
  async (req, res) => {
    try {
      const employee_id = req.params.employee_id;
      const {
        designation_id,
        employee_name,
        job_title,
        salary,
        email,
        phone_number,
        home_address,
      } = req.body;
      const result = await pool.query(
        'UPDATE employees SET designation_id = $1, employee_name = $2, job_title = $3, salary = $4, employee_image = $5, email = $6, phone_number = $7, home_address = $8 WHERE employee_id = $9;',
        [
          designation_id,
          employee_name,
          job_title,
          salary,
          req.file.path.replace('\\', '/'),
          email,
          phone_number,
          home_address,
          employee_id,
        ]
      );
      res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

/**
 * DELETE: Delete an existing employee
 * http://localhost:4000/api/employees/employee:id
 */
app.delete('/api/employees/:employee_id', async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    await pool.query('DELETE FROM employees WHERE employee_id = $1;', [
      employee_id,
    ]);
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
