export interface ThemePreset {
    name: string;
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
}

export interface IGetThemePresetsUseCase {
    execute(): Promise<ThemePreset[]>;
}

export class GetThemePresetsUseCase implements IGetThemePresetsUseCase {
    async execute(): Promise<ThemePreset[]> {
        return [
            {
                name: 'Clean Professional',
                mode: 'light',
                primaryColor: '#009063',
                secondaryColor: '#3b3b3b',
                accentColor: '#dfdcef',
                backgroundColor: '#fbfbfb',
                textColor: '#3b3b3b',
            },
            {
                name: 'Ocean Blue',
                mode: 'light',
                primaryColor: '#3B82F6',
                secondaryColor: '#0EA5E9',
                accentColor: '#06B6D4',
                backgroundColor: '#3B82F6',
                textColor: '#FFFFFF',
            },
            {
                name: 'Forest Green',
                mode: 'light',
                primaryColor: '#10B981',
                secondaryColor: '#059669',
                accentColor: '#34D399',
                backgroundColor: '#10B981',
                textColor: '#FFFFFF',
            },
            {
                name: 'Royal Purple',
                mode: 'light',
                primaryColor: '#8B5CF6',
                secondaryColor: '#7C3AED',
                accentColor: '#A78BFA',
                backgroundColor: '#8B5CF6',
                textColor: '#FFFFFF',
            },
            {
                name: 'Sunset Orange',
                mode: 'light',
                primaryColor: '#F97316',
                secondaryColor: '#EA580C',
                accentColor: '#FB923C',
                backgroundColor: '#F97316',
                textColor: '#FFFFFF',
            },
            {
                name: 'Rose Pink',
                mode: 'light',
                primaryColor: '#EC4899',
                secondaryColor: '#DB2777',
                accentColor: '#F472B6',
                backgroundColor: '#EC4899',
                textColor: '#FFFFFF',
            },
            {
                name: 'Crimson Red',
                mode: 'light',
                primaryColor: '#EF4444',
                secondaryColor: '#DC2626',
                accentColor: '#F87171',
                backgroundColor: '#EF4444',
                textColor: '#FFFFFF',
            },
            {
                name: 'Teal Wave',
                mode: 'light',
                primaryColor: '#14B8A6',
                secondaryColor: '#0D9488',
                accentColor: '#2DD4BF',
                backgroundColor: '#14B8A6',
                textColor: '#FFFFFF',
            },
            {
                name: 'Indigo Night',
                mode: 'light',
                primaryColor: '#6366F1',
                secondaryColor: '#4F46E5',
                accentColor: '#818CF8',
                backgroundColor: '#6366F1',
                textColor: '#FFFFFF',
            },
            {
                name: 'Midnight Dark',
                mode: 'dark',
                primaryColor: '#60A5FA',
                secondaryColor: '#3B82F6',
                accentColor: '#93C5FD',
                backgroundColor: '#1F2937',
                textColor: '#F9FAFB',
            },
            {
                name: 'Emerald Dark',
                mode: 'dark',
                primaryColor: '#34D399',
                secondaryColor: '#10B981',
                accentColor: '#6EE7B7',
                backgroundColor: '#1F2937',
                textColor: '#F9FAFB',
            },
        ];
    }
}
