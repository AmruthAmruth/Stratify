import { z } from "zod";

/* ============================================================
   AUTH MODULE
============================================================ */
export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    industry: z.string().min(1, "Industry is required"),
    description: z.string().min(1, "Description is required"),
    businessRegNo: z.string().min(1, "Business Reg. No is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipcode: z.string().min(1, "Zipcode is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),

    profileImage: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
      .optional(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


/* ============================================================
   DEPARTMENTS MODULE
============================================================ */
export const addDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().min(1, "Description is required").optional(),
});


/* ============================================================
   MEMBERS MODULE
============================================================ */
export const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\+?[0-9\s]+$/, "Phone number must contain only digits and optional +"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid joining date",
  }),
  position: z.string().min(1, "Position is required"),
  departmentId: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
});


/* ============================================================
   SUBSCRIPTION PLANS MODULE
============================================================ */
export const addPlanSchema = z.object({
  plan: z.string().min(1, "Plan is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(499, "Amount must be >= 499"),
  durationInMonths: z.coerce.number().min(1, "Duration must be >= 1 month"),
});


/* ============================================================
   REJECTION / APPROVAL MODULE
============================================================ */
export const rejectionValidationSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const createRejectLeaveSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});



export const updateSprintSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export const updateTaskSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});


/* ============================================================
   PROJECTS MODULE
============================================================ */
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  key: z.string().min(1, "Project key is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date is required",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date is required",
  }),
  status: z.enum(["Planned", "Active", "Completed", "Archived"], {
    required_error: "Status is required",
  }),
});


/* ============================================================
   LEAVE MANAGEMENT MODULE
============================================================ */
export const createLeaveSchema = z
  .object({
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Start date is required and must be a valid date",
      })
      .refine((val) => {
        const today = new Date();
        const start = new Date(val);
        return start.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
      }, {
        message: "Start date cannot be in the past",
      }),

    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "End date is required and must be a valid date",
    }),

    type: z.enum(["Casual", "Sick", "Earned"], {
      errorMap: () => ({
        message: "Leave type must be Casual, Sick, or Earned",
      }),
    }),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end.setHours(0, 0, 0, 0) >= start.setHours(0, 0, 0, 0);
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );


/* ============================================================
   ISSUE MANAGEMENT MODULE
============================================================ */
export const createIssueSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  acceptanceCriteria: z.string().min(1, "Acceptance Criteria is required"),
  size: z.string().min(1, "Size is required"),
  estimatedHours: z.string().min(1, "Estimated Hours is required"),
  type: z.enum(["User Story", "Bug"], {
    errorMap: () => ({ message: "Type must be either User Story or Bug" }),
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
});



export const updateIssueSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  acceptanceCriteria: z.string().min(1, "Acceptance Criteria is required"),

  size: z.number({
    required_error: "Size is required",
    invalid_type_error: "Size must be a number",
  }),

  estimatedHours: z.number({
    required_error: "Estimated Hours is required",
    invalid_type_error: "Estimated Hours must be a number",
  }),

  type: z.enum(["User Story", "Bug"], {
    errorMap: () => ({ message: "Type must be either User Story or Bug" }),
  }),

  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
});






/* ============================================================
   SPRINTS MODULE
============================================================ */
export const createSprintSchema = z.object({
  name: z.string().min(1, "Sprint Name is required"),
  goal: z.string().min(1, "Goal is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date is required and must be a valid date",
  }),

  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date is required and must be a valid date",
  }),

  status: z.enum(["Planned", "Active", "Completed"]).optional(),
});


/* ============================================================
   SUBTASK MODULE
============================================================ */
export const createSubTaskSchema = z.object({
  issueId: z.string().min(1, "Issue ID is required"),
  heading: z.string().min(1, "Subtask Heading is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["To Do", "In Progress", "Done", "Blocked"]).optional(),
  assignedToId: z.string().nullable().optional(),
});
