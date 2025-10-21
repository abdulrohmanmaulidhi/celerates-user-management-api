// Utility functions for consistent API responses

export const successResponse = (data, message = "Success", statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};

export const errorResponse = (message, error = null, statusCode = 500) => {
  return {
    success: false,
    message,
    error: error ? (process.env.NODE_ENV === "development" ? error : "Internal server error") : null,
    statusCode
  };
};

export const paginatedResponse = (data, pagination, message = "Success") => {
  return {
    success: true,
    message,
    data,
    pagination,
    statusCode: 200
  };
};