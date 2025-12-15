import { ISprintRepository } from "../../../domain/repositories/ISprintRepository";
import { IIssueRepository } from "../../../domain/repositories/IIssueRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";
import { LeaveImpactDTO, AffectedSprint } from "../../dto/leave/LeaveImpactDTO";
import { IAnalyzeLeaveImpactUseCase } from "../../interfaces/leave/IAnalyzeLeaveImpactUseCase";
import { DateUtils } from "../../../shared/utils/DateUtils";

export class AnalyzeLeaveImpactUseCase implements IAnalyzeLeaveImpactUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _issueRepo: IIssueRepository,
        private _employeeRepo: IEmployeeRepository
    ) { }

    async execute(employeeId: string, startDate: Date, endDate: Date): Promise<LeaveImpactDTO> {
        
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) {
            throw new AppError(Messages.EMPLOYEE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        
        const employeeIssues = await this._issueRepo.findByUserId(employeeId);

        
        const projectIds = [...new Set(employeeIssues.map(issue => issue.projectId))];

        
        const allSprints: unknown[] = [];
        for (const projectId of projectIds) {
            const projectSprints = await this._sprintRepo.findByProject(projectId);
            allSprints.push(...projectSprints);
        }

        const overlappingSprints = allSprints.filter(sprint => {
            return DateUtils.hasOverlap(
                sprint.startDate,
                sprint.endDate,
                startDate,
                endDate
            );
        });

        
        const affectedSprints: AffectedSprint[] = [];
        let totalImpactHours = 0;

        for (const sprint of overlappingSprints) {
            
            const assignedIssues = await this._issueRepo.findBySprintAndAssignee(
                (sprint as { id?: string }).id!,
                employeeId
            );

            if (assignedIssues.length > 0) {
                
                const overlap = DateUtils.getOverlapDays(
                    startDate,
                    endDate,
                    (sprint as { startDate: Date }).startDate,
                    (sprint as { endDate: Date }).endDate
                );

                const leaveDays = overlap
                    ? DateUtils.calculateWorkingDays(overlap.start, overlap.end)
                    : 0;

                const impactHours = leaveDays * 8;
                const estimatedHours = assignedIssues.reduce((sum: number, issue: { estimatedHours: number }) => sum + issue.estimatedHours, 0);

                totalImpactHours += impactHours;

                affectedSprints.push({
                    sprintId: sprint.id!,
                    sprintName: sprint.name,
                    assignedIssues: assignedIssues.length,
                    estimatedHours,
                    leaveDays,
                    impactHours
                });
            }
        }

        
        const requiresReassignment = affectedSprints.length > 0;

        
        const suggestions: string[] = [];

        if (affectedSprints.length === 0) {
            suggestions.push("No sprint commitments affected by this leave");
        } else {
            suggestions.push(`This leave affects ${affectedSprints.length} sprint(s)`);
            suggestions.push(`Total impact: ${totalImpactHours} hours of work during leave period`);

            if (totalImpactHours > 0) {
                suggestions.push("Consider reassigning affected tasks to other team members");
                suggestions.push("Or adjust sprint commitments to account for reduced capacity");
            }

            
            affectedSprints.forEach(sprint => {
                suggestions.push(
                    `Sprint "${sprint.sprintName}": ${sprint.assignedIssues} task(s), ${sprint.estimatedHours}h total work`
                );
            });
        }

        return {
            affectedSprints,
            requiresReassignment,
            suggestions
        };
    }
}
