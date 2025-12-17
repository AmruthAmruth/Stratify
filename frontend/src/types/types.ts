// ============================================
// API Response Types
// ============================================

export interface DashboardStats {
    totalEmployees: number;
    totalManagers: number;
    activeDepartments: number;
    activeProjects: number;
    completedProjects: number;
    pendingLeaves: number;
    totalMeetings: number;
}

export interface ChartData {
    labels: string[];
    data: number[];
}

export interface CompanyAnalytics {
    stats: DashboardStats;
    chartData: {
        departmentDistribution: ChartData;
        projectStatus: ChartData;
        employeeByDepartment: ChartData;
        leaveStatus: ChartData;
        meetingTypes: ChartData;
        companyActivity: ChartData;
    };
}

// ============================================
// Department & Team Types
// ============================================

export interface Department {
    id: string;
    name: string;
    description?: string;
    managerId?: string;
    managerName?: string;
    employeeCount?: number;
    createdAt?: string;
}

export interface DepartmentFormData {
    name: string;
    description?: string;
    managerId?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    position?: string;
    departmentId?: string;
    departmentName?: string;
    profileImage?: string;
}

export interface EmployeeFormData {
    name: string;
    email: string;
    phone: string;
    position: string;
    departmentId: string;
    password: string;
}

export interface ManagerFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    departmentId?: string;
}

export interface AddMemberFormData {
    employeeId: string;
    departmentId: string;
}

// ============================================
// Leave Management Types
// ============================================

export interface Leave {
    id: string;
    employeeId: string;
    employeeName?: string;
    departmentId?: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeaveFormData {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface LeaveStatusUpdateData {
    leaveId: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

// ============================================
// Chat & Messaging Types
// ============================================

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    isRead: boolean;
    createdAt: string;
}

export interface ChatTeamMember {
    id: string;
    name: string;
    email?: string;
    role?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

export interface GroupChatMessage {
    id: string;
    groupId: string;
    senderId: string;
    senderName: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
}

export interface GroupChat {
    id: string;
    name: string;
    type: 'department' | 'project' | 'custom';
    members: Array<{ id: string; name: string }>;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

// ============================================
// Meeting Types
// ============================================

export interface Meeting {
    id: string;
    title: string;
    description?: string;
    meetingType: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
    createdBy: string;
    createdByName?: string;
    participants: string[];
    status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    createdAt?: string;
}

export interface MeetingFormData {
    title: string;
    description?: string;
    meetingType: string;
    startTime: string;
    endTime: string;
    participants: string[];
}

// ============================================
// Project Types (extending existing)
// ============================================

export interface Project {
    id: string;
    name: string;
    key: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    departmentId: string;
    projectLeadId: string;
    companyId: string;
    employees?: Array<{ id: string; name: string; position: string }>;
    backlog?: unknown[];
    activeSprints?: unknown[];
    plannedSprints?: unknown[];
    completedSprints?: unknown[];
}

export interface ProjectsResponse {
    projects: Project[];
    total?: number;
}

export interface SubTask {
    id: string;
    heading: string;
    description: string;
    hours: number;
    status: string;
    assignedToId: string;
    assignedToName?: string;
    issueId?: string;
}

export interface SubTaskFormData {
    heading: string;
    description: string;
    hours: number;
    status: string;
    assignedToId: string;
    issueId: string;
}

export interface Issue {
    id: string;
    heading: string;
    description: string;
    acceptanceCriteria?: string;
    size?: number;
    type: string;
    status: string;
    priority: string;
    assignedTo?: string;
    sprintId?: string;
    subTasks?: SubTask[];
    projectId?: string;
    projectName?: string;
}

// ============================================
// Subscription & Payment Types
// ============================================

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    duration?: string;
    isActive?: boolean;
}

export interface PaymentResponse {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
}

export interface PaymentVerificationData {
    orderId: string;
    paymentId: string;
    signature: string;
    planName: string;
    companyId?: string;
}

// ============================================
// User & Profile Types
// ============================================

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'company' | 'manager' | 'employee' | 'superadmin';
    position?: string;
    departmentId?: string;
    departmentName?: string;
    companyId?: string;
    companyName?: string;
    profileImage?: string;
    createdAt?: string;
}

export interface SuperAdminProfile {
    id: string;
    name: string;
    email: string;
    role: 'superadmin';
    createdAt?: string;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, unknown>;
}

export interface NotificationEventData {
    notification: Notification;
}

// ============================================
// Socket Event Types
// ============================================

export interface SocketMessageEvent {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    createdAt: string;
}

export interface SocketGroupMessageEvent {
    id: string;
    groupId: string;
    senderId: string;
    senderName: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    createdAt: string;
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Array<{ field: string; message: string }>;
}

export interface FormError {
    field: string;
    message: string;
}

// ============================================
// Utility Types
// ============================================

export interface PaginationParams {
    page?: number;
    pageSize?: number;
    cursor?: string;
}

export interface FilterParams {
    filter?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
}

export interface TableRowData {
    id: string;
    [key: string]: string | number | boolean | null | undefined;
}

// ============================================
// Allocation Types
// ============================================

export interface ForecastAllocation {
    id: string;
    employeeId: string;
    employeeName?: string;
    projectId: string;
    projectName?: string;
    hoursPerWeek: number;
    allocationPercentage: number;
    startDate: string;
    endDate?: string;
}

export interface AllocationFormData {
    employeeId: string;
    projectId: string;
    hoursPerWeek: number;
    allocationPercentage: number;
    startDate: string;
    endDate?: string;
}

// ============================================
// Company Types
// ============================================

export interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    industry: string;
    description?: string;
    businessRegNo: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    status: string;
    profileImage?: string;
    createdAt?: string;
}

export interface CompanyListResponse {
    companies: Company[];
    total: number;
    page: number;
    pageSize: number;
}

export interface DepartmentDetails {
    department: Department;
    manager?: TeamMember;
    employees: TeamMember[];
}
