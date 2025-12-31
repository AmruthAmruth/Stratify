import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeConfig, DEFAULT_THEME } from "@/types/theme";

const initialState: ThemeConfig = {
    ...DEFAULT_THEME,
    companyId: undefined,
    isCompanyTheme: false
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setFullTheme: (state, action: PayloadAction<ThemeConfig>) => {
            return { ...action.payload };
        },
        setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.themeMode = action.payload;
        },
        updateThemeColor: (state, action: PayloadAction<{ field: keyof ThemeConfig; value: string }>) => {
            const { field, value } = action.payload;
            if (typeof state[field] === 'string') {
                (state as Record<string, string | boolean>)[field] = value;
            }
        },
        resetToDefault: () => {
            return { ...DEFAULT_THEME, companyId: undefined, isCompanyTheme: false };
        },
        resetToDefaultTheme: () => {
            return { ...DEFAULT_THEME, companyId: undefined, isCompanyTheme: false };
        },
        setCustomTheme: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
            return {
                ...state,
                ...action.payload,
                isCustom: true,
            };
        },
    },
});

export const { setFullTheme, setThemeMode, updateThemeColor, resetToDefault, setCustomTheme, resetToDefaultTheme } = themeSlice.actions;
export default themeSlice.reducer;
