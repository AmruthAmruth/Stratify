

export const AUTH_ROUTES = {
  SUPER_ADMIN_LOGIN: "/super-admin/login",
  COMPANY_REGISTER: "/company/register",
  COMPANY_VERIFY_OTP: "/company/verify-otp",
  COMPANY_LOGIN: "/company/login",
  COMPANY_LOGOUT: "/company/logout",
  RESEND_OTP: "/company/resend-otp",
  FORGOT_PASSWORD: "/company/forgotpassword",
  FORGOT_PASSWORD_VERIFY_OTP: "/company/forgotpassword-verifyotp",
  RESET_PASSWORD: "/company/resetpassword",
};


export const COMPANY_ROUTES = {
  ALL_COMPANIES: "/company/companies",
  COMPANY_DEPARTMENTS: "/company/company-departments",
  CREATE_DEPARTMENT: "/company/create-department",
  CREATE_EMPLOYEE: "/company/create-employee",
  CREATE_MANAGER: "/company/create-manager",
  TEAM_MEMBERS: "/company/team-members",
  UNASSIGNED_MANAGERS: "/company/unassigned-managers",
  UNASSIGNED_DEPARTMENTS: "/company/unassigned-department",
  DEPARTMENT_DETAILS: (id: string) => `/company/department-details/${id}`,
  TEAM_MEMBER_PROFILE: (id: string) => `/company/team-member-profile/${id}`,
  COMPANY_PROFILE: (id: string) => `/company/company/${id}`,
  SUBSCRIPTION_PLANS: "/company/subscription-plans",
  PURCHASE: "/company/purchase",
  PURCHASE_UNAUTH: "/company/purchase-unauthenticated",
  VERIFY_PAYMENT: "/company/verify-payment",
  VERIFY_PAYMENT_UNAUTH: "/company/verify-payment-unauthorized",
  APPROVE_COMPANY: "/company/approve-company",
  UNAPPROVE_COMPANY: "/company/unapprove-company",
  MANAGER_DEPARTMENTS: (id: string) => `/company/manager-departments/${id}`,
  LIST_PURCHASED_COMPANY: "/company/list-purchased-company",
};




export const SUPER_ADMIN_ROUTES = {
  CREATE_PLAN: "/super-admin/create-plan",
  UPDATE_PLAN: "/super-admin/update-plan",
  DELETE_PLAN: "/super-admin/delete-plan",
};





export const PROJECT_ROUTES = {
  COMPANY_PROJECTS:"/company/company-projects",
  DEPARTMENT_PROJECTS:"/company/department-projects",
  PROJECT_DETAILS:(id: string) =>`company/project/${id}`
};