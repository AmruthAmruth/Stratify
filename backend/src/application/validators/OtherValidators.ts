import { z } from "zod";

export const CreateForecastAllocationSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
    sprintId: z.string().optional(),
    allocatedHours: z.number().positive("Allocated hours must be positive"),
    role: z.string().optional(),
}).passthrough();

export const UpdateForecastAllocationSchema = z.object({
    allocatedHours: z.number().positive("Allocated hours must be positive").optional(),
    role: z.string().optional(),
}).passthrough();

export const CreateMeetingSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    participants: z.array(z.string()).optional(),
}).passthrough();

export const GenerateTokenSchema = z.object({
    roomId: z.string().min(1, "Room ID is required").optional(),
}).passthrough();

export const CreateGroupChatSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    departmentId: z.string().optional(),
    members: z.array(z.string()).optional(),
}).passthrough();

export const AddMemberToGroupSchema = z.object({
    memberId: z.string().min(1, "Member ID is required"),
}).passthrough();

export const CreateNotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.string().optional(),
}).passthrough();

export const UpdateNotificationStatusSchema = z.object({
    notificationId: z.string().min(1, "Notification ID is required"),
    isRead: z.boolean().optional(),
}).passthrough();
