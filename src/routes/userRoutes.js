import express from "express";
import { getUsers, getProfile, updateProfile, uploadAvatar, updatePassword, deleteUser } from "../controllers/userController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { validateUpdateUser } from "../middleware/validate.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         example: john@example.com
 *                       role:
 *                         type: string
 *                         example: user
 *                       avatar_url:
 *                         type: string
 *                         example: null
 *                       created_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *                     total_items:
 *                       type: integer
 *                       example: 50
 *                     items_per_page:
 *                       type: integer
 *                       example: 10
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Error fetching users
 */
router.get("/", verifyToken, isAdmin, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   type: object
 *                   example: null
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete("/:id", verifyToken, isAdmin, deleteUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     avatar_url:
 *                       type: string
 *                       example: null
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       401:
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching profile
 */
router.get("/profile", verifyToken, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updatedusername
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: updatedusername
 *                     email:
 *                       type: string
 *                       example: updated@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     avatar_url:
 *                       type: string
 *                       example: null
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Error updating profile
 */
router.put("/profile", verifyToken, validateUpdateUser, updateProfile);

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, JPG, PNG)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar_url:
 *                       type: string
 *                       example: https://res.cloudinary.com/your-cloud/image/upload/avatars/avatar_1.jpg
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Upload failed
 */
router.post("/avatar", verifyToken, upload.single("file"), uploadAvatar);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Update user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Current password is incorrect or new password validation failed
 *       401:
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating password
 */
router.put("/password", verifyToken, updatePassword);

export default router;
