const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');

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
app.use(express.json());
app.use('/images', express.static('images'));
const port = 4000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employeesdb',
  password: 'Adrian_8231',
  port: 5432,
});

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
      res.status(200).json(result.rows);
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

app.listen(port, () => console.log(`Server is running on port: ${port}`));
