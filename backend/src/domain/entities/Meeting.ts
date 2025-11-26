export class Meeting {
    constructor(
        public readonly id: string | undefined,
        public readonly roomId: string,
        public readonly creatorId: string,
        public readonly title: string,
        public readonly status: 'open' | 'closed',
        public readonly projectId: string | undefined,
        public readonly isRecurring: boolean,
        public readonly scheduledDate: Date | undefined,
        public readonly createdAt: Date
    ) { }
}