const pool = require('../config/db');

// CREATE
const create = async (req, res) => {
  const { name, price, stock, category_id } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'name y price son obligatorios' });
  const [result] = await pool.query(
    'INSERT INTO products (name, price, stock, category_id) VALUES (?, ?, ?, ?)',
    [name, price, stock || 0, category_id || null]
  );
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
};

// READ ALL
const findAll = async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
  `);
  res.json(rows);
};

// READ ONE
const findById = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(rows[0]);
};

// UPDATE
const update = async (req, res) => {
  const { name, price, stock, category_id } = req.body;
  const [exist] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Producto no encontrado' });
  await pool.query(
    'UPDATE products SET name = ?, price = ?, stock = ?, category_id = ? WHERE id = ?',
    [name, price, stock ?? 0, category_id || null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
};

// DELETE
const remove = async (req, res) => {
  const [exist] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Producto no encontrado' });
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.status(204).send();
};

module.exports = { create, findAll, findById, update, remove };
