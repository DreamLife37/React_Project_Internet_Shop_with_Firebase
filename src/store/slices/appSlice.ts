import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus(state, action) {
            console.log(action.payload)
            state.isLoading = action.payload.isLoading
        },
    }
})
export const {setAppStatus} = appSlice.actions
export const appReducer = appSlice.reducer
