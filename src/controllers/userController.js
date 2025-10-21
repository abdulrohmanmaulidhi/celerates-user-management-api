import { getAllUsers, findUserById, updateUser, deleteUser as deleteUserService, updateUserAvatar, updatePassword as updatePasswordService } from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { comparePassword } from "../utils/hash.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json(errorResponse("Page number must be greater than 0", null, 400));
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json(errorResponse("Limit must be between 1 and 100", null, 400));
    }

    const result = await getAllUsers(page, limit);
    res.json(paginatedResponse(result.data, result.pagination, "Users retrieved successfully"));
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json(errorResponse("Error fetching users", err.message));
  }
};

// Get detail user sendiri
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found", null, 404));
    }
    res.json(successResponse(user, "User profile retrieved successfully"));
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json(errorResponse("Error fetching profile", err.message));
  }
};

// Update profil sendiri
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    const updatedUser = await updateUser(userId, { username, email });
    res.json(successResponse(updatedUser, "Profile updated successfully"));
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json(errorResponse("Error updating profile", err.message));
  }
};

// Delete user by admin
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Admin deletes other user by ID
    const deleted = await deleteUserService(userId);
    if (!deleted) {
      return res.status(404).json(errorResponse("User not found", null, 404));
    }
    res.json(successResponse(null, "User deleted successfully"));
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json(errorResponse("Error deleting user", err.message));
  }
};

// Upload avatar sendiri
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse("No file uploaded", null, 400));
    }

    // Validasi tipe file
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json(errorResponse("Invalid file type. Only images allowed.", null, 400));
    }

    const userId = req.user.id;

    // Fungsi untuk mengupload ke Cloudinary
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "avatars", public_id: `avatar_${userId}` }, (err, result) => {
          if (err) {
            console.error("Cloudinary Upload Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    // Simpan URL ke database
    const updatedUser = await updateUserAvatar(userId, result.secure_url);

    res.json(successResponse({ avatar_url: updatedUser.avatar_url, updated_at: updatedUser.updated_at }, "Avatar uploaded successfully"));
  } catch (err) {
    console.error("Upload Avatar Error:", err);
    res.status(500).json(errorResponse("Upload failed", err.message));
  }
};

// Update password sendiri (tambahan opsional)
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Ambil user untuk verifikasi password lama
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json(errorResponse("User not found", null, 404));
    }

    const isValidCurrentPassword = await comparePassword(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return res.status(400).json(errorResponse("Current password is incorrect", null, 400));
    }

    if (newPassword.length < 6) {
      return res.status(400).json(errorResponse("New password must be at least 6 characters", null, 400));
    }

    await updatePasswordService(userId, newPassword);

    res.json(successResponse(null, "Password updated successfully"));
  } catch (err) {
    console.error("Update Password Error:", err);
    res.status(500).json(errorResponse("Error updating password", err.message));
  }
};
