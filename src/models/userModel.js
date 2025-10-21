import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { hashPassword } from "../utils/hash.js";

export const createUser = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await hashPassword(password);
  const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, avatar_url, created_at, updated_at";
  const { rows } = await pool.query(query, [username, email, hashedPassword]);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateUser = async (id, updateData) => {
  const { username, email } = updateData;
  // Only update fields that are provided
  const query = "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, username, email, role, avatar_url, created_at, updated_at";
  const { rows } = await pool.query(query, [username || null, email || null, id]);
  return rows[0];
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  const query = "UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING avatar_url, updated_at";
  const { rows } = await pool.query(query, [avatarUrl, userId]);
  return rows[0];
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = "SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2";
  const countQuery = "SELECT COUNT(*) FROM users";
  
  const [usersResult, countResult] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery)
  ]);
  
  const users = usersResult.rows;
  const total = parseInt(countResult.rows[0].count);
  
  return {
    data: users,
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

export const deleteUser = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);
  const query = "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role, avatar_url, created_at, updated_at";
  const { rows } = await pool.query(query, [hashedPassword, userId]);
  return rows[0];
};
