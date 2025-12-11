export interface AffectedSprint {
    sprintId: string;
    sprintName: string;
    assignedIssues: number;
    estimatedHours: number;
    leaveDays: number;
    impactHours: number;
}

export interface LeaveImpactDTO {
    affectedSprints: AffectedSprint[];
    requiresReassignment: boolean;
    suggestions: string[];
}
