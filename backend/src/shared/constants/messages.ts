export const Messages = {
  // Login messages
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid credentials",
  MISSING_FIELDS: "Required fields are missing",
  UNAUTHORIZED_ACCESS: "You are not authorized",
  SERVER_ERROR: "Something went wrong on the server",

  // Registration messages
  REGISTER_SUCCESS: "Registration successful",
  REGISTER_FAILED: "Registration failed",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  PASSWORD_TOO_WEAK: "Password is too weak",
  INVALID_EMAIL_FORMAT: "Invalid email format",

  // General Auth messages
  TOKEN_EXPIRED: "Session expired. Please log in again",
  INVALID_TOKEN: "Invalid token",
  ACCESS_DENIED: "Access denied",
  LOGOUT_SUCCESS: "Logged out successfully",
} as const;
