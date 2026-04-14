const pool = require('../config/db');

// CREATE
const create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'El campo name es obligatorio' });
  const [result] = await pool.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description || null]
  );
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
};

// READ ALL
const findAll = async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY id DESC');
  res.json(rows);
};

// READ ONE
const findById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(rows[0]);
};

// UPDATE
const update = async (req, res) => {
  const { name, description } = req.body;
  const [exist] = await pool.query('SELECT id FROM categories WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Categoría no encontrada' });
  await pool.query(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description || null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
};

// DELETE
const remove = async (req, res) => {
  const [exist] = await pool.query('SELECT id FROM categories WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Categoría no encontrada' });
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.status(204).send();
};

module.exports = { create, findAll, findById, update, remove };
