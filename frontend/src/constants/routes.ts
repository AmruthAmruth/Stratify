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
  UPDATE_PROJECT: "/api/project/project",
  CREATE_SUB_TASK: "/api/project/create-sub-task",
  CREATE_SPRINT: "/api/project/create-sprint",
  ASSIGN_TO_SPRINT: "/api/project/assigned-to-sprint",
  PROJECT_LEVEL_ALLOCATION: "/api/project/projectlevel-allocated-employee",
  DELETE_PROJECT: (id: string) => `/api/project/project/${id}`,
  CREATE_ISSUE: "/api/project/create-issue",
  GET_EMPLOYEE_UNDER_PROJECT: (id: string) => `/api/project/issuelevel-allcated-employee/${id}`,
  GET_DEPARTMENT_EMPLOYEES: "/api/project/projectlevel-allocated-employee",
  GET_EMPLOYEE_NOT_IN_PROJECT: (id: string) => `/api/project/employee-out-project/${id}`,
  Add_EMPLOYEE_TO_PROJECT: '/api/project/add-employee-project',
  ASSINGED_STORY_TO_SPRINT: '/api/project/assing-to-sprint',
  GET_ISSSUES_FOR_EMPLOYEE: '/api/project/issues',
  UPDATE_ISSUE: '/api/project/update-issue',
  DELETE_ISSUE: (issueId: string) => `/api/project/delete-issue/${issueId}`,
  REMOVE_EMPLOYEE_TO_PROJECT: '/api/project/remove-emp'
}

// Leave routes 
export const LEAVE_ROUTES = {
  CREATE_LEAVE: "/api/leave/create-leave",
  GET_EMPLOYEE_CURRENT_MONTHLEAVE: "/api/leave/leaves",
  GET_DEPARTMENT_LEAVE: "/api/leave/department-leaves",
  LEAVE_STATUS_UPDATE: "/api/leave/leave-status",
};


export const NOTIFICATION_ROUTES = {
  GET_NOTIFICATIONS: "/api/notification",
  TOGGLE_STATUS_UPDATE: "/api/notification/update-status",
  DELETE_NOTIFICATION: "/api/notification/delete-notification",
  DELETE_ALL_NOTIFICATION: "/api/notification/delete-all-notification",
  READ_ALL_NOTIFICATION: "/api/notification/read-all"
}


export const MEETING_ROUTES = {
  CREATE_MEETING: "/api/meeting",
  GENARATE_TOKEN: "/api/meeting/token",
  JOING_MEETING: '/api/meeting/join',
  CLOSE_MEETING: '/api/meeting/close',
  GET_MEETINGS_BY_CREATOR: "/api/meeting",
  GET_MEETINGS_FOR_EMPLOYEE: '/api/meeting/meetings',
}


export const CHAT_ROUTES = {
  SENT_MESSAGE: "/api/chat/send",
  TEAM_MEMEBER_LIST: "/api/chat/team",
  CHAT_HISTROY_ROUTES: "/api/chat/history",
  MARK_AS_READ: "/api/chat/mark-read",
  UNREAD_COUNTS: "/api/chat/unread-counts",
};

export const GROUP_CHAT_ROUTES = {
  CREATE_GROUP: '/api/group-chat/create',
  SEND_MESSAGE: '/api/group-chat/send',
  GET_MESSAGES: (groupId: string) => `/api/group-chat/${groupId}/messages`,
  MY_GROUPS: '/api/group-chat/my-groups',
  ADD_MEMBER: (groupId: string) => `/api/group-chat/${groupId}/members`,
  REMOVE_MEMBER: (groupId: string, memberId: string) => `/api/group-chat/${groupId}/members/${memberId}`,
}