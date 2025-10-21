import express from "express";
import { 
  createAdminUser, 
  getAdmins, 
  getAdminById, 
  updateAdminUser, 
  deleteAdminUser,
  adminLogin
} from "../controllers/adminController.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
import { validateRegister, validateLogin } from "../middleware/validate.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: adminuser
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: AdminPassword123
 *     responses:
 *       201:
 *         description: Admin user created successfully
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
 *                   example: Admin user created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: adminuser
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *                     avatar_url:
 *                       type: string
 *                       example: null
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       409:
 *         description: Admin with this email already exists
 *       500:
 *         description: Admin creation failed
 */
router.post("/register", validateRegister, createAdminUser);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: AdminPassword123
 *     responses:
 *       200:
 *         description: Admin login successful
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
 *                   example: Admin login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: adminuser
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *                     avatar_url:
 *                       type: string
 *                       example: null
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Admin login failed
 */
router.post("/login", validateLogin, adminLogin);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
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
 *         description: Admins retrieved successfully
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
 *                   example: Admins retrieved successfully
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
 *                         example: adminuser
 *                       email:
 *                         type: string
 *                         example: admin@example.com
 *                       role:
 *                         type: string
 *                         example: admin
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
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied. Admins only.
 *       500:
 *         description: Error fetching admins
 */
router.get("/", verifyToken, isAdmin, getAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin retrieved successfully
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
 *                   example: Admin retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: adminuser
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
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
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error fetching admin
 */
router.get("/:id", verifyToken, isAdmin, getAdminById);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Update admin information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updatedadmin
 *               email:
 *                 type: string
 *                 example: updatedadmin@example.com
 *     responses:
 *       200:
 *         description: Admin updated successfully
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
 *                   example: Admin updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: updatedadmin
 *                     email:
 *                       type: string
 *                       example: updatedadmin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
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
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error updating admin
 */
router.put("/:id", verifyToken, isAdmin, updateAdminUser);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
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
 *                   example: Admin deleted successfully
 *                 data:
 *                   type: object
 *                   example: null
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied. Admins only.
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error deleting admin
 */
router.delete("/:id", verifyToken, isAdmin, deleteAdminUser);

export default router;