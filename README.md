# User Management API

A comprehensive REST API for user management with authentication, authorization, file upload, profile management, and admin functionalities. This API provides a complete solution for managing users in web applications with modern security practices.

## 🚀 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (user/admin)
  - Secure password hashing with bcrypt
  - Protected routes with middleware

- **User Management**

  - User registration with validation
  - User login/logout
  - Profile management (view, update)
  - Avatar upload to Cloudinary
  - Password update with current password validation
  - User deletion (admin only)

- **Admin Management**

  - Admin registration and login
  - Admin CRUD operations
  - Admin-specific endpoints

- **Security**

  - Input validation with Joi
  - Helmet security headers
  - CORS configuration
  - Password strength requirements

- **File Upload**

  - Avatar uploads to Cloudinary
  - File type validation
  - Secure image handling

- **Pagination**

  - Built-in pagination for user lists
  - Configurable page size and number

- **API Documentation**
  - Complete Swagger UI documentation
  - Interactive API testing interface

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt (password hashing), Helmet, CORS
- **Validation**: Joi
- **File Storage**: Cloudinary
- **Documentation**: Swagger UI
- **File Upload**: Multer with Cloudinary storage
- **Environment Management**: Dotenv

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account for file storage

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Update the values with your configuration

4. **Database setup**

   - Create a PostgreSQL database
   - Update the database credentials in your `.env` file
   - The application will automatically create the required tables

5. **Cloudinary setup**

   - Sign up for a free Cloudinary account
   - Add your Cloudinary credentials to the `.env` file

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the API**
   - API base URL: `http://localhost:5000/api`
   - API documentation: `http://localhost:5000/api-docs`

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_very_secret_jwt_key_here_must_be_very_long
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=12

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at `http://localhost:5000/api-docs`

### API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint    | Description           | Token Required |
| ------ | ----------- | --------------------- | -------------- |
| POST   | `/register` | Register a new user   | No             |
| POST   | `/login`    | Login to user account | No             |

**Request Example (Register):**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Users (`/api/users`)

| Method | Endpoint    | Description                | Token Required | Role Required |
| ------ | ----------- | -------------------------- | -------------- | ------------- |
| GET    | `/`         | Get all users (admin only) | Yes            | Admin         |
| GET    | `/profile`  | Get current user's profile | Yes            | -             |
| PUT    | `/profile`  | Update user profile        | Yes            | -             |
| POST   | `/avatar`   | Upload user avatar         | Yes            | -             |
| PUT    | `/password` | Update user password       | Yes            | -             |
| DELETE | `/:id`      | Delete user (admin only)   | Yes            | Admin         |

**Request Example (Update Profile):**

```json
{
  "username": "updated_username",
  "email": "updated@example.com"
}
```

#### Admin (`/api/admin`)

| Method | Endpoint    | Description        | Token Required | Role Required |
| ------ | ----------- | ------------------ | -------------- | ------------- |
| POST   | `/register` | Register new admin | No             | -             |
| POST   | `/login`    | Login as admin     | No             | -             |
| GET    | `/`         | Get all admins     | Yes            | Admin         |
| GET    | `/:id`      | Get admin by ID    | Yes            | Admin         |
| PUT    | `/:id`      | Update admin       | Yes            | Admin         |
| DELETE | `/:id`      | Delete admin       | Yes            | Admin         |

## 📁 Project Structure

```
src/
├── index.js                  # Main application entry point
├── config/
│   ├── db.js                 # Database configuration
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/              # Request handlers
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
│   └── adminController.js    # Admin management logic
├── middleware/               # Custom middleware
│   ├── auth.js               # Authentication middleware
│   ├── validate.js           # Validation middleware
│   ├── upload.js             # File upload middleware
│   └── errorHandler.js       # Error handling middleware
├── models/                   # Database models
│   ├── userModel.js          # User data operations
│   └── adminModel.js         # Admin data operations
├── routes/                   # API routes
│   ├── index.js              # Main route handler
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User routes
│   └── adminRoutes.js        # Admin routes
├── utils/                    # Utility functions
│   ├── generateToken.js      # JWT token generation
│   ├── hash.js               # Password hashing
│   └── response.js           # Response formatting
└── database/                 # Database setup
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Joi validation for all request parameters
- **File Upload Security**: MIME type validation, file size limits
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers for Express.js applications
- **Rate Limiting**: Built-in protection against abuse (can be added)

## 📁 File Upload

The API supports avatar uploads with the following specifications:

- Supported formats: JPEG, JPG, PNG
- Automatic upload to Cloudinary
- Secure storage with public ID based on user ID
- Automatic resize and optimization

## 🧪 Testing

To run the API tests:

```bash
npm test
```

## 🚀 Deployment

### Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name "user-management-api"
   ```

### Environment-Specific Considerations

- Use secure JWT secrets in production
- Configure proper database connection pooling
- Set up SSL/TLS certificates
- Configure proper CORS origins for production
- Set up monitoring and logging

## 📊 Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details (optional)"
}
```

**Paginated Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "items_per_page": 10
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 🐛 Issues

If you encounter any issues or have feature requests, please open an issue in the repository with:

- A clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the repository or contact the maintainers.

---

**Made with ❤️ by Abdul Rohman Maulidhi**
