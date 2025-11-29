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
  PHONE_ALREADY_EXISTS: "Phone number is already exist",
  PASSWORD_RESET_SUCCESS: "Password Reset Successfull",

  // General Auth messages
  TOKEN_EXPIRED: "Session expired. Please log in again",
  INVALID_TOKEN: "Invalid token",
  ACCESS_DENIED: "Access denied",
  LOGOUT_SUCCESS: "Logged out successfully",
  ACCOUNT_PENDING_APPROVAL: "Your account is still pending approval by Stratify Team.",
  SUBSCRIPTION_INACTIVE: "Your subscription is not active. Please subscribe to continue.",

  // OTP messages
  OTP_SENT: "OTP has been sent to email successfully",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_RESENT: "A new OTP has been resent successfully.",

  // Token messages
  NO_REFREASHTOKEN: "No refresh token provided",

  // Project messages
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Updated the project successfully!",
  PROJECT_DELETED: "Project Deleted Successfully!",
  USER_STORY_CREATED: "User story created successfully",
  BACKLOG_CREATED: "Backlog created successfully",
  TASK_CREATED: "Task created successfully",
  ISSUE_CREATED: "Issue Created Successfully",
  ISSUE_UPDATED: "Updated Issue Successfully!",
  ISSUE_DELETED: "Issue Deleted Successfully!",
  SPRINT_CREATED: "Sprint Created Successfully!",
  SPRINT_UPDATED: "Sprint Updated Successfully!",
  SPRINT_DELETED: "Sprint Deleted Successfully!",
  SUBTASK_CREATED: "Task Created Successfully",
  SUBTASK_UPDATED: "Subtask Updated Successfully!",
  SUBTASK_DELETED: "Subtask Deleted Successfully!",
  ISSUE_ASSIGNED_TO_SPRINT: "Assine Issue to Sprint",
  EMPLOYEE_ADDED_TO_PROJECT: "Added Employee to the Project",
  EMPLOYEE_REMOVED_FROM_PROJECT: "Employee Removed Successfully from project!",

  // Meeting messages
  MEETING_CREATED: "Meeting Created Successfully!",
  MEETING_CLOSED: "Meeting Closed Successfully",
  TOKEN_GENERATED: "Token Generated Successfully",

  // Subscription messages
  SUBSCRIPTION_PURCHASED: "Subscription purchased successfully",
  PAYMENT_VERIFIED: "Payment verified & subscription activated",
  PLAN_CREATED: "Plan created successfully",
  PLAN_UPDATED: "Updated Plan Successfully",
  PLAN_DELETED: "Deleted Plan Successfully",

  // Notification messages
  NOTIFICATION_CREATED: "Notification Created Successfully!",
  ALL_NOTIFICATIONS: "All Notification",
  NOTIFICATION_STATUS_UPDATED: "Notification Status updated",
  NOTIFICATION_DELETED: "Deleted Notification",
  ALL_NOTIFICATIONS_DELETED: "Delete all notifications",

  // Chat messages
  USER_NOT_AUTHENTICATED: "User not authenticated",
  RECEIVER_ID_AND_MESSAGE_REQUIRED: "receiverId and message are required",
  MESSAGE_SENT: "Message sent successfully",
  SENDER_ID_REQUIRED: "senderId is required",
  MESSAGES_MARKED_AS_READ: "Messages marked as read",
  FAILED_TO_MARK_AS_READ: "Failed to mark messages as read",
  FAILED_TO_GET_UNREAD_COUNTS: "Failed to get unread counts",

  // Group Chat messages
  GROUP_NAME_AND_MEMBERS_REQUIRED: "name and members array are required",
  GROUP_CREATED: "Group created successfully",
  GROUP_NOT_FOUND: "Group not found",
  NOT_GROUP_MEMBER: "You are not a member of this group",
  GROUP_MESSAGE_SENT: "Message sent to group",
  MEMBER_ADDED_TO_GROUP: "Member added to group",
  MEMBER_REMOVED_FROM_GROUP: "Member removed from group",

  // Department messages
  DEPARTMENT_CREATED: "Department created successfully",
  DEPARTMENT_NOT_FOUND: "Department not found",
  DEPARTMENT_HAS_MANAGER: "Department Already Have a Manager",

  // Employee/Manager messages
  MANAGER_CREATED: "Manager created successfully",
  EMPLOYEE_CREATED: "Employee created successfully",
  EMPLOYEE_NOT_FOUND: "Employee not found",
  MANAGER_NOT_FOUND: "Manager not found",
  INVALID_CREATOR_ID: "Invalid creator ID",
  MANAGER_DEPARTMENT_RESTRICTION: "Manager can only add employees in their own department",

  // Leave messages
  LEAVE_CREATED: "Leave created successfully",
  LEAVE_NOT_FOUND: "Leave not found",
  INVALID_LEAVE_STATUS: "Invalid status. Must be 'Approved' or 'Rejected'.",
  REASON_REQUIRED_FOR_REJECTION: "Reason is required when rejecting a leave",

  // Company messages
  COMPANY_APPROVED: "Company approved successfully",
  COMPANY_UNAPPROVED: "Company unapproved successfully",
  COMPNAY_NOT_FOUND: "Company not found",

  // Error messages
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  FORBIDDEN: "Forbidden",
  REGISTRATION_DATA_EXPIRED: "Registration data expired",
  PASSWORD_MISSING: "Password is missing in temporary registration data",

  // Profile messages
  PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
  PROFILE_UPDATE_FAILED: "Profile update failed",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
  PASSWORD_CHANGE_FAILED: "Password change failed",
  COMPANY_DEACTIVATED: "Company account has been deactivated",
  COMPANY_ACTIVATED: "Company account has been activated",
  MANAGER_ALREADY_EXISTS: "Manager with this email already exists",
} as const;
