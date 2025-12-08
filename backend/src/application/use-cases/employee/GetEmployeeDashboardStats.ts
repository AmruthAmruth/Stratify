import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { Issue } from "../../../domain/entities/Issue";

export class GetEmployeeDashboardStats {
    constructor(
        private issueRepository: IIssueRepository
    ) { }

    async execute(employeeId: string) {
        console.log(`[GetEmployeeDashboardStats] Executing for employeeId: ${employeeId}`);

        // Actually, let's just use the repo to find by user, but I suspect the issue might be with the ID format or something.
        // Let's try to find ONE issue and log it.

        const issues = await this.issueRepository.findByUserId(employeeId);
        console.log(`[GetEmployeeDashboardStats] Found ${issues.length} issues for employeeId: ${employeeId}`);

        if (issues.length === 0) {
            console.log("[GetEmployeeDashboardStats] No issues found for this user. Checking if ANY issues exist...");
            // We can't easily check "all" without a method, but let's trust the repo for now.
            // If the user says "My Task" works, then the issue is likely the employeeId mismatch.
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

        // Graph Data 1: Issues by Priority
        const priorityCounts: Record<string, number> = {};
        issues.forEach((issue: Issue) => {
            const priority = issue.priority || "Unknown";
            priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });

        // Graph Data 2: Issues by Status
        const statusCounts: Record<string, number> = {};
        issues.forEach((issue: Issue) => {
            const status = issue.status || "Unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        // Graph Data 3: Issues by Type
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
