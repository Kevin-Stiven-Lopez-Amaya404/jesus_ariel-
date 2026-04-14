const pool = require('../config/db');

// CREATE
const create = async (req, res) => {
  const { customer, product_id, quantity } = req.body;
  if (!customer || !product_id) return res.status(400).json({ error: 'customer y product_id son obligatorios' });

  const [prod] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
  if (!prod.length) return res.status(404).json({ error: 'Producto no encontrado' });

  const total = prod[0].price * (quantity || 1);
  const [result] = await pool.query(
    'INSERT INTO orders (customer, product_id, quantity, total) VALUES (?, ?, ?, ?)',
    [customer, product_id, quantity || 1, total]
  );
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
};

// READ ALL
const findAll = async (_req, res) => {
  const [rows] = await pool.query(`
    SELECT o.*, p.name AS product_name
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    ORDER BY o.id DESC
  `);
  res.json(rows);
};

// READ ONE
const findById = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT o.*, p.name AS product_name
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    WHERE o.id = ?
  `, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(rows[0]);
};

// UPDATE
const update = async (req, res) => {
  const { customer, product_id, quantity, status } = req.body;
  const [exist] = await pool.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Orden no encontrada' });

  let total = null;
  if (product_id && quantity) {
    const [prod] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
    if (prod.length) total = prod[0].price * quantity;
  }
  await pool.query(
    'UPDATE orders SET customer = ?, product_id = ?, quantity = ?, total = ?, status = ? WHERE id = ?',
    [customer, product_id, quantity, total, status || 'pending', req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
};

// DELETE
const remove = async (req, res) => {
  const [exist] = await pool.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
  if (!exist.length) return res.status(404).json({ error: 'Orden no encontrada' });
  await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
  res.status(204).send();
};

module.exports = { create, findAll, findById, update, remove };
