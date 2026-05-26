import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  min: Number(process.env.DB_POOL_MIN) || 2,
  max: Number(process.env.DB_POOL_MAX) || 10,
  acquireTimeoutMillis: Number(process.env.DB_POOL_ACQUIRE) || 30000,
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE) || 10000,
  connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT) || 10000,
});

export async function connectPostgres() {
  try {
    const client = await pool.connect();

    const { rows } = await client.query('SELECT * FROM usuarios WHERE cedula = $1', ['1130267052']);

    console.info(rows);

    client.release();
    console.info('[DB] ✅  PostgreSQL connected');
  } catch (err) {
    console.error('[DB] ❌  PostgreSQL connection failed:', err.message);
    console.error(
      `       host=${process.env.POSTGRES_HOST} port=${process.env.POSTGRES_PORT} db=${process.env.POSTGRES_DB} user=${process.env.POSTGRES_USER}`
    );
    throw err;
  }
}

export default pool;
