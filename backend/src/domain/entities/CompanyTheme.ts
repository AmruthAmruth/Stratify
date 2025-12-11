export class CompanyTheme {
    constructor(
        public id: string | undefined,
        public companyId: string,
        public backgroundColor: string,
        public textColor: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }
}
