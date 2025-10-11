// Auth routes
export const AUTH_ROUTES = {
  SUPER_ADMIN_LOGIN: "api/auth/super-admin-login", 
  COMPANY_REGISTER: "/api/auth/register",
  COMPANY_VERIFY_OTP: "/api/auth/verify-otp",
  COMPANY_LOGIN: "/api/auth/login",
  COMPANY_LOGOUT: "/api/auth/logout",
  RESEND_OTP: "/api/auth/resend-otp",
  FORGOT_PASSWORD: "/api/auth/forgotpassword",
  FORGOT_PASSWORD_VERIFY_OTP: "/api/auth/forgotpassword-verifyotp",
  RESET_PASSWORD: "/api/auth/resetpassword",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  LOGOUT: "/api/auth/logout",
};

// Company routes
export const COMPANY_ROUTES = {
  ALL_COMPANIES: "/api/company/companies",
  COMPANY_DEPARTMENTS: "/api/department/company-departments",
  CREATE_DEPARTMENT: "/api/department/create-department",
  CREATE_EMPLOYEE: "/api/employee/create-employee",
  CREATE_MANAGER: "/api/employee/create-manager",
  TEAM_MEMBERS: "/api/company/company-employees",
  UNASSIGNED_MANAGERS: "/api/employee/unassigned-managers",
  UNASSIGNED_DEPARTMENTS: "/api/department/unassigned-department",
  DEPARTMENT_DETAILS: (id: string) => `/api/department/department-details/${id}`,
  TEAM_MEMBER_PROFILE: (id: string) => `/api/company/team-member-profile/${id}`,
  COMPANY_PROFILE: (id: string) => `/api/company/company/${id}`,
  SUBSCRIPTION_PLANS: "/api/subscription/subscription-plans",
  PURCHASE: "/api/subscription/purchase",
  PURCHASE_UNAUTH: "/api/subscription/purchase-unauthenticated",
  VERIFY_PAYMENT: "/api/subscription/verify-payment",
  VERIFY_PAYMENT_UNAUTH: "/api/subscription/verify-payment-unauthorized",
  APPROVE_COMPANY: "/api/company/approve-company",
  UNAPPROVE_COMPANY: "/api/company/unapprove-company",
  MANAGER_DEPARTMENTS: (id: string) => `/api/department/manager-departments/${id}`,
  LIST_PURCHASED_COMPANY: "/super-admin/list-purchased-company",
};

// Subscription Admin Routes
export const SUPER_ADMIN_ROUTES = {
  CREATE_PLAN: "/api/subscription/create-plan",
  UPDATE_PLAN: "/api/subscription/update-plan",
  DELETE_PLAN: "/api/subscription/delete-plan",

};

// Project routes
export const PROJECT_ROUTES = {
  COMPANY_PROJECTS: "/api/project/company-projects",
  DEPARTMENT_PROJECTS: "/api/project/department-projects",
  PROJECT_DETAILS: (id: string) => `/api/project/project/${id}`,
  CREATE_PROJECT: "/api/project/create-project",
  CREATE_SUB_TASK: "/api/project/create-sub-task",
  CREATE_SPRINT: "/api/project/create-sprint",
  ASSIGN_TO_SPRINT: "/api/project/assigned-to-sprint",
  PROJECT_LEVEL_ALLOCATION:"/api/project/projectlevel-allocated-employee",
  DELETE_PROJECT: (id: string) =>`/api/project/project/${id}`,
  CREATE_ISSUE:"/api/project/create-issue",
  GET_EMPLOYEE_UNDER_PROJECT: (id: string) => `/api/project/issuelevel-allcated-employee/${id}`,
  GET_DEPARTMENT_EMPLOYEES:"/api/project/projectlevel-allocated-employee",
  GET_EMPLOYEE_NOT_IN_PROJECT: (id: string) =>`/api/project/employee-out-project/${id}`,
  Add_EMPLOYEE_TO_PROJECT:'/api/project/add-employee-project'

}

// Leave routes 
export const LEAVE_ROUTES = {
  CREATE_LEAVE: "/api/leave/create-leave",
  GET_EMPLOYEE_CURRENT_MONTHLEAVE: "/api/leave/leaves",
  GET_DEPARTMENT_LEAVE: "/api/leave/department-leaves",
  LEAVE_STATUS_UPDATE: "/api/leave/leave-status",
};
