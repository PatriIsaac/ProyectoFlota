import { Pool } from 'pg';
import "dotenv/config";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
    const res = await pool.query('SELECT email FROM "Usuario"');
    console.log('Users in DB:', res.rows);
}
main().finally(() => pool.end());
