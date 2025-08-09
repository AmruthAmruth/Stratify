import { createSlice } from "@reduxjs/toolkit";


type ThemeState ={
    mode:'light' | 'dark'
}

const initialState: ThemeState = {
  mode: 'light',
};


const themSlice=createSlice({
    name:'theme',
    initialState,
    reducers:{
        toggleTheme:(state)=>{
            state.mode = state.mode=== 'light' ? 'dark' : 'light'
        },
        setTheme:(state,action)=>{
            state.mode=action.payload
        },
    },
})


export const {toggleTheme,setTheme} = themSlice.actions;
export default themSlice.reducer;





