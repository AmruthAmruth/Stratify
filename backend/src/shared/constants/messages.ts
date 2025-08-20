export const Messages = {
  // Login messages
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid credentials",
  MISSING_FIELDS: "Required fields are missing",
  UNAUTHORIZED_ACCESS: "You are not authorized",
  SERVER_ERROR: "Something went wrong on the server",

  // Registration messages
  REGISTER_SUCCESS: "Company Registration Successful",
  REGISTER_FAILED: "Company Registration Failed",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  COMPANY_ALREADY_EXISTS: "Company is already registered",
  PASSWORD_TOO_WEAK: "Password is too weak",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  EMAIL_NOT_FOUND: "Email not found",
  COMPANY_NOT_FOUND: "Company not found",
 PHONE_ALREADY_EXISTS:"Phone number is already exist",
  // General Auth messages

  TOKEN_EXPIRED: "Session expired. Please log in again",
  INVALID_TOKEN: "Invalid token",
  ACCESS_DENIED: "Access denied",
  LOGOUT_SUCCESS: "Logged out successfully",

  // OTP messages
  OTP_SENT: "OTP has been sent to email successfully",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  OTP_VERIFIED: "OTP verified successfully",

  // Token messages
  NO_REFREASHTOKEN: "No refresh token provided",
} as const;
