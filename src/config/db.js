import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
});

pool.on("connect", () => {
  console.log("[INFO] PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("[ERROR] Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
