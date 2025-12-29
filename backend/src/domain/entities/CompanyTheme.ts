export type ThemeMode = 'light' | 'dark';

export class CompanyTheme {
    constructor(
        public id: string | undefined,
        public companyId: string,
        public themeName: string,
        public themeMode: ThemeMode,
        public primaryColor: string,
        public secondaryColor: string,
        public accentColor: string,
        public backgroundColor: string,
        public textColor: string,
        public surfaceColor: string,
        public borderColor: string,
        public mutedColor: string,
        public headingColor: string,
        public isCustom: boolean = false,
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }
}
