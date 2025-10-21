import { createUser, findUserByEmail } from "../models/userModel.js";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword } from "../utils/hash.js";
import { successResponse, errorResponse } from "../utils/response.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cek apakah user sudah ada
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json(errorResponse("User with this email already exists", "Registration failed", 409));
    }

    const newUser = await createUser({ username, email, password });

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(successResponse(userWithoutPassword, "User registered successfully", 201));
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json(errorResponse("Registration failed", err.message));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json(errorResponse("User not found", "Login failed", 404));
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json(errorResponse("Invalid credentials", "Login failed", 401));
    }

    // Buat token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = user;

    res.json(successResponse({ ...userWithoutPassword, token }, "Login successful"));
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json(errorResponse("Login failed", err.message));
  }
};
