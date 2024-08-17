import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

import './saleSheduler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '',
  password: '',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

// Type for request body
interface CartItem {
  item_id: number;
  title: string;
  price: number;
  img: string;
  amount: number;
}

// Route to get all items
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err as Error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add an item to the cart
app.post('/api/cart', async (req: Request, res: Response) => {
  const { item_id, title, price, img, amount }: CartItem = req.body;

  if (item_id == null || title == null || price == null || img == null || amount == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO cart (item_id, title, price, img, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [item_id, title, price, img, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err as Error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all cart items
app.get('/api/cart', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (err) {
    console.error(err as Error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update item amount in the cart
app.patch('/api/cart/:item_id', async (req: Request, res: Response) => {
  const item_id = parseInt(req.params.item_id, 10);
  const { amount }: { amount: number } = req.body;

  if (isNaN(item_id) || isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await pool.query(
      'UPDATE cart SET amount = $1 WHERE item_id = $2 RETURNING *',
      [amount, item_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err as Error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to remove an item from the cart
app.delete('/api/cart/:item_id', async (req: Request, res: Response) => {
  const item_id = parseInt(req.params.item_id, 10);
  try {
    const result = await pool.query('DELETE FROM cart WHERE item_id = $1', [item_id]);
    if (result.rowCount! > 0) { // Use non-null assertion operator
      res.status(204).end(); // No Content
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err as Error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
