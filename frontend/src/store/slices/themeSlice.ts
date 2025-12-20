import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    mode: 'light' | 'dark';
    companyColor: string;
}

const initialState: ThemeState = {
    mode: 'light',
    companyColor: '#009063',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
        },
        setCompanyColor: (state, action: PayloadAction<string>) => {
            state.companyColor = action.payload;
        },
    },
});

export const { toggleTheme, setTheme, setCompanyColor } = themeSlice.actions;
export default themeSlice.reducer;
