export class ForecastAllocation {
    constructor(
        public id: string | undefined,
        public employeeId: string,
        public projectId: string,
        public forecastHoursPerWeek: number,
        public startDate: Date,
        public endDate: Date | null,
        public status: "Active" | "Completed" | "Cancelled" = "Active",
        public notes: string | undefined,
        public createdBy: string,
        public createdByModel: "Company" | "Manager",
        public companyId: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) { }
}
