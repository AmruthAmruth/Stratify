import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { Issue } from "../../../domain/entities/Issue";

export class GetEmployeeDashboardStats {
    constructor(
        private issueRepository: IIssueRepository
    ) { }

    async execute(employeeId: string) {
        console.log(`[GetEmployeeDashboardStats] Executing for employeeId: ${employeeId}`);


        const issues = await this.issueRepository.findByUserId(employeeId);
        console.log(`[GetEmployeeDashboardStats] Found ${issues.length} issues for employeeId: ${employeeId}`);

        if (issues.length === 0) {
            console.log("[GetEmployeeDashboardStats] No issues found for this user. Checking if ANY issues exist...");
           
        }

        console.log(`[GetEmployeeDashboardStats] Issues:`, JSON.stringify(issues, null, 2));

        const totalAssigned = issues.length;
        const pendingIssues = issues.filter(
            (issue: Issue) =>
                (issue.status || "").toLowerCase() === "todo" ||
                (issue.status || "").toLowerCase() === "in-progress" ||
                (issue.status || "").toLowerCase() === "in progress"
        ).length;
        const completedIssues = issues.filter(
            (issue: Issue) => (issue.status || "").toLowerCase() === "completed" || (issue.status || "").toLowerCase() === "done"
        ).length;

        
        const priorityCounts: Record<string, number> = {};
        issues.forEach((issue: Issue) => {
            const priority = issue.priority || "Unknown";
            priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });

        
        const statusCounts: Record<string, number> = {};
        issues.forEach((issue: Issue) => {
            const status = issue.status || "Unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        
        const typeCounts: Record<string, number> = {};
        issues.forEach((issue: Issue) => {
            const type = issue.type || "Task";
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        return {
            stats: {
                totalAssigned,
                pendingIssues,
                completedIssues,
            },
            graphs: {
                issuesByPriority: {
                    labels: Object.keys(priorityCounts),
                    data: Object.values(priorityCounts),
                },
                issuesByStatus: {
                    labels: Object.keys(statusCounts),
                    data: Object.values(statusCounts),
                },
                issuesByType: {
                    labels: Object.keys(typeCounts),
                    data: Object.values(typeCounts),
                },
            },
        };
    }
}
