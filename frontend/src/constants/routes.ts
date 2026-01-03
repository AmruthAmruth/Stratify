// ===================== AUTH ROUTES =====================
export const AUTH_ROUTES = {
  SUPER_ADMIN_LOGIN: "/auth/super-admin-login",
  COMPANY_REGISTER: "/auth/register",
  COMPANY_VERIFY_OTP: "/auth/verify-otp",
  COMPANY_LOGIN: "/auth/login",
  COMPANY_LOGOUT: "/auth/logout",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgotpassword",
  FORGOT_PASSWORD_VERIFY_OTP: "/auth/forgotpassword-verifyotp",
  RESET_PASSWORD: "/auth/resetpassword",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
};

// ===================== COMPANY ROUTES =====================
export const COMPANY_ROUTES = {
  ALL_COMPANIES: "/company/companies",
  COMPANY_DEPARTMENTS: "/department/company-departments",
  CREATE_DEPARTMENT: "/department/create-department",
  CREATE_EMPLOYEE: "/employee/create-employee",
  CREATE_MANAGER: "/employee/create-manager",
  TEAM_MEMBERS: "/company/company-employees",
  UNASSIGNED_MANAGERS: "/employee/unassigned-managers",
  UNASSIGNED_DEPARTMENTS: "/department/unassigned-department",
  DEPARTMENT_DETAILS: (id: string) => `/department/department-details/${id}`,
  TEAM_MEMBER_PROFILE: (id: string) => `/company/team-member-profile/${id}`,
  COMPANY_PROFILE: (id: string) => `/company/company/${id}`,
  SUBSCRIPTION_PLANS: "/subscription/subscription-plans",
  PURCHASE: "/subscription/purchase",
  PURCHASE_UNAUTH: "/subscription/purchase-unauthenticated",
  VERIFY_PAYMENT: "/subscription/verify-payment",
  VERIFY_PAYMENT_UNAUTH: "/subscription/verify-payment-unauthorized",
  APPROVE_COMPANY: "/company/approve-company",
  UNAPPROVE_COMPANY: "/company/unapprove-company",
  MANAGER_DEPARTMENTS: (id: string) => `/department/manager-departments/${id}`,
  LIST_PURCHASED_COMPANY: "/super-admin/list-purchased-company",
  COMPANY_ANALYTICS: "/company/company-analytics",
  UPDATE_PROFILE: "/company/profile",
};

// ===================== SUPER ADMIN ROUTES =====================
export const SUPER_ADMIN_ROUTES = {
  CREATE_PLAN: "/subscription/create-plan",
  UPDATE_PLAN: "/subscription/update-plan",
  DELETE_PLAN: "/subscription/delete-plan",
  DASHBOARD_STATS: "/subscription/dashboard-stats",
};

// ===================== PROJECT ROUTES =====================
export const PROJECT_ROUTES = {
  COMPANY_PROJECTS: "/project/company-projects",
  DEPARTMENT_PROJECTS: "/project/department-projects",
  EMPLOYEE_PROJECTS: "/project/employee-projects",
  PROJECT_DETAILS: (id: string) => `/project/project/${id}`,
  CREATE_PROJECT: "/project/create-project",
  UPDATE_PROJECT: "/project/project",
  CREATE_SUB_TASK: "/project/create-sub-task",
  CREATE_SPRINT: "/project/create-sprint",
  UPDATE_SPRINT: "/project/update-sprint",
  DELETE_SPRINT: (id: string) => `/project/delete-sprint/${id}`,
  ASSIGN_TO_SPRINT: "/project/assigned-to-sprint",
  PROJECT_LEVEL_ALLOCATION: "/project/projectlevel-allocated-employee",
  UPDATE_SUB_TASK: "/project/update-sub-task",
  DELETE_SUB_TASK: (id: string) => `/project/delete-sub-task/${id}`,
  DELETE_PROJECT: (id: string) => `/project/project/${id}`,
  CREATE_ISSUE: "/project/create-issue",
  GET_EMPLOYEE_UNDER_PROJECT: (id: string) => `/project/issuelevel-allocated-employee/${id}`,
  GET_DEPARTMENT_EMPLOYEES: "/project/projectlevel-allocated-employee",
  GET_EMPLOYEE_NOT_IN_PROJECT: (id: string) => `/project/employee-out-project/${id}`,
  ADD_EMPLOYEE_TO_PROJECT: "/project/add-employee-project",
  ASSINGED_STORY_TO_SPRINT: "/project/assign-to-sprint",
  GET_ISSUES_FOR_EMPLOYEE: "/project/issues",
  GET_ISSUES_FOR_MANAGER: "/project/manager/issues",
  UPDATE_ISSUE: "/project/update-issue",
  DELETE_ISSUE: (issueId: string) => `/project/delete-issue/${issueId}`,
  REMOVE_EMPLOYEE_TO_PROJECT: "/project/remove-emp",
};

// ===================== LEAVE ROUTES =====================
export const LEAVE_ROUTES = {
  CREATE_LEAVE: "/leave/create-leave",
  GET_EMPLOYEE_CURRENT_MONTHLEAVE: "/leave/leaves",
  GET_DEPARTMENT_LEAVE: "/leave/department-leaves",
  LEAVE_STATUS_UPDATE: "/leave/leave-status",
};

// ===================== NOTIFICATION ROUTES =====================
export const NOTIFICATION_ROUTES = {
  GET_NOTIFICATIONS: "/notification",
  TOGGLE_STATUS_UPDATE: "/notification/update-status",
  DELETE_NOTIFICATION: "/notification/delete-notification",
  DELETE_ALL_NOTIFICATION: "/notification/delete-all-notification",
  READ_ALL_NOTIFICATION: "/notification/read-all",
};

// ===================== MEETING ROUTES =====================
export const MEETING_ROUTES = {
  CREATE_MEETING: "/meeting",
  GENARATE_TOKEN: "/meeting/token",
  JOING_MEETING: "/meeting/join",
  CLOSE_MEETING: "/meeting/close",
  GET_MEETINGS_BY_CREATOR: "/meeting",
  GET_MEETINGS_FOR_EMPLOYEE: "/meeting/meetings",
};

// ===================== CHAT ROUTES =====================
export const CHAT_ROUTES = {
  SENT_MESSAGE: "/chat/send",
  TEAM_MEMEBER_LIST: "/chat/team",
  CHAT_HISTROY_ROUTES: "/chat/history",
  MARK_AS_READ: "/chat/mark-read",
  UNREAD_COUNTS: "/chat/unread-counts",
};

// ===================== GROUP CHAT ROUTES =====================
export const GROUP_CHAT_ROUTES = {
  CREATE_GROUP: "/group-chat/create",
  SEND_MESSAGE: "/group-chat/send",
  GET_MESSAGES: (groupId: string) => `/group-chat/${groupId}/messages`,
  MY_GROUPS: "/group-chat/my-groups",
  ADD_MEMBER: (groupId: string) => `/group-chat/${groupId}/members`,
  REMOVE_MEMBER: (groupId: string, memberId: string) =>
    `/group-chat/${groupId}/members/${memberId}`,
  DEPARTMENT_GROUPS: "/group-chat/department-groups",
  MY_DEPARTMENT_GROUP: "/group-chat/my-department-group",
};

// ===================== MANAGER ROUTES =====================
export const MANAGER_ROUTES = {
  GET_PROFILE: "/manager/profile",
  UPDATE_PROFILE: "/manager/profile",
  CHANGE_PASSWORD: "/manager/change-password",
};

// ===================== EMPLOYEE ROUTES =====================
export const EMPLOYEE_ROUTES = {
  GET_PROFILE: "/employee/profile",
  UPDATE_PROFILE: "/employee/profile",
};
