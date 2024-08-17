import cron from 'node-cron';
import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  user: 'postgres',
  password: 'sarath@3',
  database: 'cricket_bat',
});

// Connect to the database
pool.connect()
  .then(() => console.log('Connected to database.'))
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Schedule a job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running sale end job');

  const query = `
    UPDATE products
    SET sale_status = 'ended'
    WHERE sale_end_time <= NOW() AND sale_status = 'active'
  `;

  try {
    const res = await pool.query(query);
    console.log('Sales ended:', res.rowCount);
  } catch (err) {
    console.error('Error ending sales:', err);
  }
});
