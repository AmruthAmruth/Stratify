import { z } from "zod";

export const CreateProjectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters"),
    key: z.string().min(2, "Project key is required"),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    departmentId: z.string().min(1, "Department ID is required"),
    status: z.enum(["Planned", "Active", "Completed", "Archived"]).optional(),
    teamMemberIds: z.array(z.string()).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
    id: z.string().min(1, "Project ID is required"),
});

export const CreateUserStorySchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["High", "Medium", "Low"]).optional(),
});

export const CreateIssueSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    description: z.string().min(1, "Description is required"),
    acceptanceCriteria: z.string().optional(),
    size: z.number().int().positive().optional(),
    type: z.enum(["User Story", "Bug"]),
    priority: z.enum(["Low", "Medium", "High"]),
    projectId: z.string().min(1, "Project ID is required"),
    assignedTo: z.string().nullable().optional(),
});

export const UpdateIssueSchema = CreateIssueSchema.partial().extend({
    id: z.string().min(1, "Issue ID is required"),
});

export const CreateSubTaskSchema = z.object({
    issueId: z.string().min(1, "Issue ID is required"),
    heading: z.string().min(1, "Heading is required"),
    description: z.string().optional(),
    hours: z.number().positive("Hours must be greater than 0"),
    status: z.enum(["To Do", "In Progress", "Done", "Blocked"]).optional(),
    assignedToId: z.string().nullable().optional(),
});

export const UpdateSubTaskSchema = CreateSubTaskSchema.partial().extend({
    id: z.string().min(1, "SubTask ID is required"),
});

export const CreateSprintSchema = z.object({
    name: z.string().min(1, "Sprint name is required"),
    goal: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    projectId: z.string().min(1, "Project ID is required"),
    status: z.enum(["Planned", "Active", "Completed"]).optional(),
});

export const UpdateSprintSchema = CreateSprintSchema.partial().extend({
    id: z.string().min(1, "Sprint ID is required"),
});

export const AssignIssueToSprintSchema = z.object({
    issueId: z.string().min(1, "Issue ID is required"),
    sprintId: z.string().min(1, "Sprint ID is required"),
});

export const AddEmployeeToProjectSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
});

export const RemoveEmployeeFromProjectSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
});

export const ValidateEmployeeCapacitySchema = z.object({
    employeeId: z.string().min(1, "Employee ID is required"),
    sprintId: z.string().min(1, "Sprint ID is required"),
    requiredHours: z.number().positive("Required hours must be positive"),
});
