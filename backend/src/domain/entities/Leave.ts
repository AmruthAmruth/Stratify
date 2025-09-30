export class Leave {
  constructor(
    public id: string | undefined,
    public employeeId: string,
    public startDate: Date,
    public endDate: Date,
    public type: "Casual" | "Sick" | "Earned" | "Other" = "Casual",
    public status: "Pending" | "Approved" | "Rejected" = "Pending",
    public reason?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public month?: number,
    public departmentId?: string,
    public companyId?: string,
    public rejectedReason?: string 
  ) {}
}
