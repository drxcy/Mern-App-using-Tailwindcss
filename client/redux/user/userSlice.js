import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    currentUser: null,
    isLoading: false,
    error: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart:(state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess:(state,action) => {
            state.currentUser=action.payload;
            state.isLoading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateStart:(start)=>
        {
            start.isLoading= true;
            start.error= null;
        },
        updateSuccess:(start,action)=>
        {
            start.currentUser=action.payload;
            start.isLoading= false;
            start.error= null;
        },
        updateFailure:(start,action)=>
        {
           
            start.isLoading= false;
            start.error= action.payload;
        },
        deleteUserStart:(state)=>
        {
            state.isLoading= true;
            state.error= null;
        },
        deleteUserSuccess:(state)=>
        {
           state.currentUser=null;
           state.isLoading= false;
           state.error= null;
        },
        deleteUserFailure:(state,action)=>
        {
           state.isLoading= false;
           state.error= action.payload;
        },
        signOutSuccess:(state)=>
        {
            state.currentUser=null;
            state.isLoading= false;
            state.error= null;
        }
    },
});

export const { signInStart, signInSuccess, signInFailure,updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess} = userSlice.actions;
export default userSlice.reducer;