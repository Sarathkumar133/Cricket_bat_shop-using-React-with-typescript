"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
require("../saleSheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// PostgreSQL connection setup
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cricket_bat',
    password: 'sarath@3',
    port: 5432,
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Route to get all items
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to add an item to the cart
app.post('/api/cart', async (req, res) => {
    const { item_id, title, price, img, amount } = req.body;
    if (item_id == null || title == null || price == null || img == null || amount == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = await pool.query('INSERT INTO cart (item_id, title, price, img, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *', [item_id, title, price, img, amount]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to get all cart items
app.get('/api/cart', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to update item amount in the cart
app.patch('/api/cart/:item_id', async (req, res) => {
    const item_id = parseInt(req.params.item_id, 10);
    const { amount } = req.body;
    if (isNaN(item_id) || isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    try {
        const result = await pool.query('UPDATE cart SET amount = $1 WHERE item_id = $2 RETURNING *', [amount, item_id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
        else {
            res.status(404).json({ error: 'Item not found' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to remove an item from the cart
app.delete('/api/cart/:item_id', async (req, res) => {
    const item_id = parseInt(req.params.item_id, 10);
    try {
        const result = await pool.query('DELETE FROM cart WHERE item_id = $1', [item_id]);
        if (result.rowCount > 0) { // Use non-null assertion operator
            res.status(204).end(); // No Content
        }
        else {
            res.status(404).json({ error: 'Item not found' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
