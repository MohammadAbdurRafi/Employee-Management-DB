const express = require('express');

const { Pool } = require('pg');

const app = express();
app.use(express.json());
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
        const result = await pool.query('SELECT * FROM designations WHERE designation_id = $1', [designation_id])
        if (result.rowCount > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Selected designation was not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

/**
 * POST: Create a designation
 * http://localhost:4000/api/designations
 */
app.post('/api/designations', async (req, res) => {
  try {
    const { designation_name, designation_description } = req.body;
    const result = await pool.query(
      'INSERT INTO designations (designation_name, designation_description) VALUES ($1, $2) RETURNING designation_id',
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
      'UPDATE designations SET designation_name = $1, designation_description = $2 WHERE designation_id = $3',
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
        await pool.query('DELETE FROM designations WHERE designation_id = $1', [designation_id])
        res.status(200).json({ message: 'Designation deleted successfully.' })
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

app.listen(port, () => console.log(`Server is running on port: ${port}`));
