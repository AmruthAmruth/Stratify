export const Messages = {

  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid credentials",
  MISSING_FIELDS: "Required fields are missing",
  UNAUTHORIZED_ACCESS: "You are not authorized",
  SERVER_ERROR: "Something went wrong on the server",


  REGISTER_SUCCESS: "Company Registration Successful",
  REGISTER_FAILED: "Company Registration Failed",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  COMPANY_ALREADY_EXISTS: "Company is already registered",
  PASSWORD_TOO_WEAK: "Password is too weak",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  EMAIL_NOT_FOUND: "Email not found",
  COMPANY_NOT_FOUND: "Company not found",
  COMPANY_ALREADY_APPROVED: "Company Already Approved",
  COMPANY_ID_REQUIRED: "Company ID is required",
  COMPANY_ANALYTICS_FETCH_FAILED: "Failed to fetch company analytics",
  NO_MEMBERS_FOUND: "No members found for this company",
  PHONE_ALREADY_EXISTS: "Phone number is already exist",
  PASSWORD_RESET_SUCCESS: "Password Reset Successfull",


  TOKEN_EXPIRED: "Session expired. Please log in again",
  INVALID_TOKEN: "Invalid token",
  ACCESS_DENIED: "Access denied",
  LOGOUT_SUCCESS: "Logged out successfully",
  ACCOUNT_PENDING_APPROVAL: "Your account is still pending approval by Stratify Team.",
  SUBSCRIPTION_INACTIVE: "Your subscription is not active. Please subscribe to continue.",


  OTP_SENT: "OTP has been sent to email successfully",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_RESENT: "A new OTP has been resent successfully.",


  NO_REFREASHTOKEN: "No refresh token provided",


  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Updated the project successfully!",
  PROJECT_DELETED: "Project Deleted Successfully!",
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_NO_DEPARTMENT: "Project does not have a department assigned",
  PROJECT_NAME_EXISTS: "Project name already exists for this company",
  PROJECT_KEY_EXISTS: "Project key already exists for this company",
  PROJECT_NOT_BELONG_TO_COMPANY: "Project does not belong to the creator's company",
  USER_STORY_CREATED: "User story created successfully",
  USER_STORY_NOT_FOUND: "UserStory not found",
  USER_STORY_TITLE_EXISTS: "User story title already exists",
  BACKLOG_CREATED: "Backlog created successfully",
  BACKLOG_NOT_FOUND: "Backlog not found",
  BACKLOG_NOT_BELONG_TO_PROJECT: "Backlog does not belong to the given project",
  BACKLOG_NAME_EXISTS: "Backlog name already exists in this project",
  TASK_CREATED: "Task created successfully",
  ISSUE_CREATED: "Issue Created Successfully",
  ISSUE_UPDATED: "Updated Issue Successfully!",
  ISSUE_DELETED: "Issue Deleted Successfully!",
  ISSUE_NOT_FOUND: "Issue not found",
  ISSUE_HEADING_EXISTS: "Issue with this heading already exists in the project",
  ISSUE_NO_ASSIGNEE: "Issue must have an assigned employee before moving to a sprint",
  SPRINT_CREATED: "Sprint Created Successfully!",
  SPRINT_UPDATED: "Sprint Updated Successfully!",
  SPRINT_DELETED: "Sprint Deleted Successfully!",
  SUPER_ADMIN_NOT_FOUND: "Super Admin not found",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  INVALID_ROLE: "Invalid role",
  INCORRECT_PASSWORD: "Current password is incorrect",
  MANAGER_UPDATE_FAILED: "Failed to update manager profile",
  INVALID_LEAVE_TYPE: "Invalid leave type",
  LEAVE_OVERLAP: "Leave overlaps with existing leave",
  LEAVE_MONTHLY_QUOTA_EXCEEDED: "Leave monthly quota exceeded",
  LEAVE_ANNUAL_QUOTA_EXCEEDED: "Leave annual quota exceeded",
  MEETING_NOT_FOUND: "Meeting Not Found",
  MEETING_ALREADY_CLOSED: "Meeting is already closed",
  MEETING_TITLE_EXISTS: "A meeting with this title already exists",
  MEETING_CLOSED: "Meeting is Closed",
  MEETING_JOIN_RESTRICTED: "You are not authorized to join this meeting",
  PLAN_ALREADY_EXISTS: "Plan already exists",
  PLAN_NOT_FOUND: "Plan not found",
  NO_PURCHASED_PLANS: "No purchased plans found",
  COMPANY_HAS_ACTIVE_SUBSCRIPTION: "Company already has an active subscription",
  PAYMENT_VERIFICATION_FAILED: "Payment verification failed",
  NOTIFICATION_NOT_FOUND: "Notification not found",
  NO_NOTIFICATIONS_FOUND: "No notifications found for this user",
  PROJECT_NAME_OR_COMPANY_ID_MISSING: "Project name or companyId is missing",
  SUBSCRIPTION_NOT_FOUND: "Subscription not found",
  TASK_NOT_FOUND: "Task not found",

  SPRINT_NOT_FOUND: "Sprint not found",
  SPRINT_DURATION_INVALID: "Sprint duration must fall within the project's start and end dates.",
  SPRINT_START_AFTER_END: "Sprint start date cannot be after sprint end date.",
  SPRINT_OVERLAP: "Sprint overlaps with existing sprint.",
  SUBTASK_CREATED: "Task Created Successfully",
  SUBTASK_UPDATED: "Subtask Updated Successfully!",
  SUBTASK_DELETED: "Subtask Deleted Successfully!",
  SUBTASK_NOT_FOUND: "Subtask not found",
  SUBTASK_CREATION_RESTRICTED: "You can only create subtasks for issues assigned to you",
  SUBTASK_HEADING_EXISTS: "Subtask with the same heading already exists",
  ISSUE_ASSIGNED_TO_SPRINT: "Assine Issue to Sprint",
  EMPLOYEE_ADDED_TO_PROJECT: "Added Employee to the Project",
  EMPLOYEE_REMOVED_FROM_PROJECT: "Employee Removed Successfully from project!",
  EMPLOYEE_NOT_IN_PROJECT: "Employee is not part of this project",
  EMPLOYEE_ALREADY_IN_PROJECT: "Employee is already part of the project",
  NO_TEAM_MEMBERS_IN_PROJECT: "No team members assigned to this project",
  EMPLOYEE_CAPACITY_EXCEEDED: "Employee capacity exceeded for this sprint",


  MEETING_CREATED: "Meeting Created Successfully!",
  MEETING_CLOSED_SUCCESS: "Meeting Closed Successfully",
  TOKEN_GENERATED: "Token Generated Successfully",


  SUBSCRIPTION_PURCHASED: "Subscription purchased successfully",
  PAYMENT_VERIFIED: "Payment verified & subscription activated",
  PLAN_CREATED: "Plan created successfully",
  PLAN_UPDATED: "Updated Plan Successfully",
  PLAN_DELETED: "Deleted Plan Successfully",


  NOTIFICATION_CREATED: "Notification Created Successfully!",
  ALL_NOTIFICATIONS: "All Notification",
  NOTIFICATION_STATUS_UPDATED: "Notification Status updated",
  NOTIFICATION_DELETED: "Deleted Notification",
  ALL_NOTIFICATIONS_DELETED: "Delete all notifications",



  USER_NOT_AUTHENTICATED: "User not authenticated",
  RECEIVER_ID_AND_MESSAGE_REQUIRED: "receiverId and message are required",
  MESSAGE_SENT: "Message sent successfully",
  SENDER_ID_REQUIRED: "senderId is required",
  MESSAGES_MARKED_AS_READ: "Messages marked as read",
  FAILED_TO_MARK_AS_READ: "Failed to mark messages as read",
  FAILED_TO_GET_UNREAD_COUNTS: "Failed to get unread counts",


  GROUP_NAME_AND_MEMBERS_REQUIRED: "name and members array are required",
  GROUP_CREATED: "Group created successfully",
  GROUP_NOT_FOUND: "Group not found",
  NOT_GROUP_MEMBER: "You are not a member of this group",
  GROUP_MESSAGE_SENT: "Message sent to group",
  MEMBER_ADDED_TO_GROUP: "Member added to group",
  MEMBER_REMOVED_FROM_GROUP: "Member removed from group",


  DEPARTMENT_CREATED: "Department created successfully",
  DEPARTMENT_EXISTS: "Department already exists",
  MANAGER_ALREADY_ASSIGNED: "Manager is already assigned to another department",
  DEPARTMENT_NOT_FOUND: "Department not found",
  DEPARTMENT_HAS_MANAGER: "Department Already Have a Manager",
  DEPARTMENT_NOT_BELONG_TO_COMPANY: "Department does not belong to creator company",


  MANAGER_CREATED: "Manager created successfully",
  EMPLOYEE_CREATED: "Employee created successfully",
  EMPLOYEE_NOT_FOUND: "Employee not found",
  MANAGER_NOT_FOUND: "Manager not found",
  INVALID_CREATOR_ID: "Invalid creator ID",
  CREATOR_NOT_FOUND: "Creator not found",
  MANAGER_DEPARTMENT_RESTRICTION: "Manager can only add employees in their own department",
  MANAGER_NO_DEPARTMENT: "Manager is not assigned to any department",
  NO_EMPLOYEES_IN_DEPARTMENT: "No employees found in this department",
  ASSIGNED_USER_NOT_EXIST: "Assigned user does not exist",
  ASSIGNED_USER_NOT_IN_COMPANY: "Assigned user does not belong to the same company as the user story",


  LEAVE_CREATED: "Leave created successfully",
  LEAVE_NOT_FOUND: "Leave not found",
  INVALID_LEAVE_STATUS: "Invalid status. Must be 'Approved' or 'Rejected'.",
  REASON_REQUIRED_FOR_REJECTION: "Reason is required when rejecting a leave",


  COMPANY_APPROVED: "Company approved successfully",
  COMPANY_UNAPPROVED: "Company unapproved successfully",
  COMPNAY_NOT_FOUND: "Company not found",
  COMPANY_ID_MISSING_AFTER_CREATION: "Company ID is missing after creation",

  INTERNAL_SERVER_ERROR: "Internal Server Error",
  FORBIDDEN: "Forbidden",
  REGISTRATION_DATA_EXPIRED: "Registration data expired",
  PASSWORD_MISSING: "Password is missing in temporary registration data",


  PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
  PROFILE_UPDATE_FAILED: "Profile update failed",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
  PASSWORD_CHANGE_FAILED: "Password change failed",
  COMPANY_DEACTIVATED: "Company account has been deactivated",
  COMPANY_ACTIVATED: "Company account has been activated",
  MANAGER_ALREADY_EXISTS: "Manager with this email already exists",

  // Theme Messages
  THEME_NOT_FOUND: "Theme not found for this company",
  THEME_RETRIEVED: "Company theme retrieved successfully",
  THEME_UPDATED: "Company theme updated successfully",
  THEME_PRESETS_RETRIEVED: "Theme presets retrieved successfully",
  THEME_CREATION_FAILED: "Failed to create company theme",
  MISSING_REQUIRED_THEME_FIELDS: "Missing required theme fields",
  COMPANY_ADMIN_REQUIRED: "Only company administrators can update themes",
  COMPANY_ADMIN_REQUIRED_APPLY: "Only company administrators can apply themes",
  USER_ID_REQUIRED: "User ID is required",
  PRESET_NAME_REQUIRED: "Preset name is required",
  INVALID_PRESET_NAME: "Invalid preset name",
  PRESET_APPLIED_SUCCESS: 'Preset theme "{presetName}" applied successfully',
  INVALID_COLOR_FORMAT: "Invalid {field} format. Please provide a valid hex color (e.g., #3B82F6)",
  MANAGER_HAS_NO_DEPARTMENT: "Manager has no department assigned",
  FORECAST_HOURS_INVALID: "Forecast hours per week must be between 1 and 168",
  FORECAST_DATE_RANGE_INVALID: "End date must be after start date",
  REGISTRATION_DATA_EXPIRED_RETRY: "Registration data expired. Please register again.",

  // Group Messages
  GROUP_ID_REQUIRED: "groupId is required",
  NEW_MEMBER_ID_REQUIRED: "newMemberId is required",
  DEPARTMENT_GROUP_UNAVAILABLE: "Department group feature not available",
  ENDPOINT_MANAGERS_EMPLOYEES_ONLY: "This endpoint is only for managers and employees",

  // Manager Messages
  PASSWORD_FIELDS_REQUIRED: "Current password and new password are required",

  // Forecast Messages
  FORECAST_CREATED: "Forecast allocation created successfully",
  FORECAST_UPDATED: "Forecast allocation updated successfully",
  FORECAST_RETRIEVED: "Forecast allocations retrieved successfully",
  FORECAST_CALCULATED: "Forecast vs actual calculated successfully",
  FORECAST_DELETED: "Forecast allocation deleted successfully",

  // Miscellaneous
  CONTACT_SUCCESS: "Thank you for your message! We'll get back to you soon.",
  RECEIVER_ID_REQUIRED: "Receiver ID is required",
  VALIDATION_FAILED: "Validation failed",
  INVALID_DOB_FORMAT: "Invalid date format for dob",
  INVALID_JOINING_DATE_FORMAT: "Invalid date format for joiningDate",
  SOCKET_WORKS: "If you see this, socket works!",

  // Rate Limiter Messages
  RATE_LIMIT_AUTH: "Too many authentication attempts from this IP, please try again after 15 minutes",
  RATE_LIMIT_API: "Too many requests from this IP, please try again after 15 minutes",
  RATE_LIMIT_PASSWORD_RESET: "Too many password reset attempts, please try again after an hour",
} as const;
