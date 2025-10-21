# User Management API

A comprehensive REST API for user management with authentication, authorization, file upload, and profile management.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- Bcrypt (password hashing)
- Cloudinary (file storage)
- Joi (validation)
- Helmet (security)
- CORS (Cross-Origin Resource Sharing)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file based on `.env.example`
4. Set up your PostgreSQL database
5. Run the application:
```bash
npm run dev
```

## API Documentation

### Authentication Routes (`/api/auth`)

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "string (3-30 characters, alphanumeric)",
    "email": "string (valid email format)",
    "password": "string (min 8 characters)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "email",
      "role": "user",
      "createdAt": "timestamp"
    }
  }
  ```

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with email and password
- **Request Body**:
  ```json
  {
    "email": "string (valid email format)",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "email",
      "role": "user"
    }
  }
  ```

### User Routes (`/api/users`)

#### Get All Users (Admin only)
- **Endpoint**: `GET /api/users`
- **Description**: Get a list of all users (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": "user_id",
      "username": "username",
      "email": "email",
      "role": "user",
      "avatar_url": "url or null",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
  ```

#### Get User Profile
- **Endpoint**: `GET /api/users/profile`
- **Description**: Get current user's profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "role": "user",
    "avatar_url": "url or null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```

#### Update User Profile
- **Endpoint**: `PUT /api/users/profile`
- **Description**: Update current user's profile
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "username": "string (optional)",
    "email": "string (optional, valid email format)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "email",
      "role": "user",
      "avatar_url": "url or null",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```

#### Upload Avatar
- **Endpoint**: `POST /api/users/avatar`
- **Description**: Upload user avatar to Cloudinary
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `file` (image file: jpeg, jpg, png)
- **Response**:
  ```json
  {
    "message": "Avatar uploaded successfully",
    "avatar_url": "cloudinary_url",
    "updated_at": "timestamp"
  }
  ```

#### Update Password
- **Endpoint**: `PUT /api/users/password`
- **Description**: Update user password
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string (min 6 characters)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

#### Delete User (Admin only)
- **Endpoint**: `DELETE /api/users/:id`
- **Description**: Delete user by ID (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

#### Delete Own Profile
- **Endpoint**: `DELETE /api/users/profile`
- **Description**: Delete current user's profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Profile deleted successfully"
  }
  ```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request - validation errors or incorrect data
- `401`: Unauthorized - invalid or missing token
- `403`: Forbidden - insufficient permissions
- `404`: Not Found - requested resource doesn't exist
- `500`: Internal Server Error - unexpected server error

## Database Schema

The application uses PostgreSQL with the following table structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Security Features

- JWT-based authentication
- Input validation with Joi
- Password hashing with bcrypt
- Helmet security headers
- CORS with limited origins
- PostgreSQL connection security
- File upload validation

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=user_management_api_db
JWT_SECRET=your_very_secret_jwt_key
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```# celerates-user-management-api
