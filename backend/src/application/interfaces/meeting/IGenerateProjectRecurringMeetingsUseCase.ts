export interface IGenerateProjectRecurringMeetingsUseCase {
    execute(projectId: string): Promise<void>;
}
