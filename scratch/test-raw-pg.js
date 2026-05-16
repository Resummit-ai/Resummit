const { Pool } = require('pg');

async function main() {
  const connectionString = "postgresql://adelmuhammed@localhost:5432/sclade";
  const pool = new Pool({
    connectionString,
  });

  try {
    console.log("Testing raw PG connection...");
    const res = await pool.query('SELECT NOW()');
    console.log("Connection successful!", res.rows[0]);

    console.log("Checking for 'User' table...");
    const tableRes = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log("Tables found:", tableRes.rows.map(r => r.tablename));

  } catch (error) {
    console.error("PG Error:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();
