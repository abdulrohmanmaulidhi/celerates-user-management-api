import { 
  createAdmin, 
  getAllAdmins, 
  findAdminById, 
  updateAdmin, 
  deleteAdmin,
  findAdminByEmail 
} from "../models/adminModel.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword } from "../utils/hash.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";

// Create a new admin user
export const createAdminUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin with this email already exists
    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json(
        errorResponse("Admin with this email already exists", "Admin creation failed", 409)
      );
    }

    const newAdmin = await createAdmin({ username, email, password });

    // Don't return password in response
    const { password: _, ...adminWithoutPassword } = newAdmin;

    res.status(201).json(
      successResponse(adminWithoutPassword, "Admin user created successfully", 201)
    );
  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json(
      errorResponse("Admin creation failed", err.message)
    );
  }
};

// Get all admin users with pagination
export const getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json(
        errorResponse("Page number must be greater than 0", null, 400)
      );
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json(
        errorResponse("Limit must be between 1 and 100", null, 400)
      );
    }
    
    const result = await getAllAdmins(page, limit);
    res.json(
      paginatedResponse(result.data, result.pagination, "Admins retrieved successfully")
    );
  } catch (err) {
    console.error("Get Admins Error:", err);
    res.status(500).json(
      errorResponse("Error fetching admins", err.message)
    );
  }
};

// Get admin by ID
export const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await findAdminById(adminId);
    
    if (!admin) {
      return res.status(404).json(
        errorResponse("Admin not found", null, 404)
      );
    }
    
    res.json(
      successResponse(admin, "Admin retrieved successfully")
    );
  } catch (err) {
    console.error("Get Admin By ID Error:", err);
    res.status(500).json(
      errorResponse("Error fetching admin", err.message)
    );
  }
};

// Update admin user
export const updateAdminUser = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { username, email } = req.body;

    const updatedAdmin = await updateAdmin(adminId, { username, email });
    
    if (!updatedAdmin) {
      return res.status(404).json(
        errorResponse("Admin not found", null, 404)
      );
    }

    res.json(
      successResponse(updatedAdmin, "Admin updated successfully")
    );
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(500).json(
      errorResponse("Error updating admin", err.message)
    );
  }
};

// Delete admin user
export const deleteAdminUser = async (req, res) => {
  try {
    const adminId = req.params.id;
    
    const deleted = await deleteAdmin(adminId);
    if (!deleted) {
      return res.status(404).json(
        errorResponse("Admin not found", null, 404)
      );
    }
    
    res.json(
      successResponse(null, "Admin deleted successfully")
    );
  } catch (err) {
    console.error("Delete Admin Error:", err);
    res.status(500).json(
      errorResponse("Error deleting admin", err.message)
    );
  }
};

// Admin login (optional - for admin-specific login if needed)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json(
        errorResponse("Admin not found", "Admin login failed", 404)
      );
    }

    const validPassword = await comparePassword(password, admin.password);
    if (!validPassword) {
      return res.status(401).json(
        errorResponse("Invalid credentials", "Admin login failed", 401)
      );
    }

    // Create JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Don't return password in response
    const { password: _, ...adminWithoutPassword } = admin;

    res.json(
      successResponse({ ...adminWithoutPassword, token }, "Admin login successful")
    );
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json(
      errorResponse("Admin login failed", err.message)
    );
  }
};