import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { hashPassword } from "../utils/hash.js";

// Create admin user with role set to 'admin'
export const createAdmin = async (adminData) => {
  const { username, email, password } = adminData;
  const hashedPassword = await hashPassword(password);
  const query = "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING id, username, email, role, avatar_url, created_at, updated_at";
  const { rows } = await pool.query(query, [username, email, hashedPassword]);
  return rows[0];
};

// Find admin by email
export const findAdminByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1 AND role = 'admin'";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

// Find admin by ID
export const findAdminById = async (id) => {
  const query = "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1 AND role = 'admin'";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// Get all admins with pagination
export const getAllAdmins = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE role = 'admin' ORDER BY created_at DESC LIMIT $1 OFFSET $2";
  const countQuery = "SELECT COUNT(*) FROM users WHERE role = 'admin'";
  
  const [adminsResult, countResult] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery)
  ]);
  
  const admins = adminsResult.rows;
  const total = parseInt(countResult.rows[0].count);
  
  return {
    data: admins,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total: total,
      total_pages: Math.ceil(total / limit),
      first_page: 1,
      last_page: Math.ceil(total / limit)
    }
  };
};

// Update admin
export const updateAdmin = async (id, updateData) => {
  const { username, email } = updateData;
  const query = "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND role = 'admin' RETURNING id, username, email, role, avatar_url, created_at, updated_at";
  const { rows } = await pool.query(query, [username || null, email || null, id]);
  return rows[0];
};

// Delete admin
export const deleteAdmin = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 AND role = 'admin' RETURNING id";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};