"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const pg_1 = require("pg");
// Database connection configuration
const pool = new pg_1.Pool({
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
node_cron_1.default.schedule('0 * * * *', async () => {
    console.log('Running sale end job');
    const query = `
    UPDATE products
    SET sale_status = 'ended'
    WHERE sale_end_time <= NOW() AND sale_status = 'active'
  `;
    try {
        const res = await pool.query(query);
        console.log('Sales ended:', res.rowCount);
    }
    catch (err) {
        console.error('Error ending sales:', err);
    }
});
