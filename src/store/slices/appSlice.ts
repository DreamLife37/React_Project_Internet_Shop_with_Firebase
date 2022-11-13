import {createSlice} from "@reduxjs/toolkit";

type InitialStateType = {
    isLoading: boolean,
    error: {
        messageError: null | string,
        typeError: 'warning' | 'error' | 'info' | 'success'
    }
}

const initialState = {
    isLoading: false,
    error: {
        messageError: null,
        typeError: 'warning'
    }
} as InitialStateType

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus(state, action) {
            state.isLoading = action.payload.isLoading
        },
        setAppError(state, action) {
            state.error = action.payload.error
        },
    }
})
export const {setAppStatus, setAppError} = appSlice.actions
export const appReducer = appSlice.reducer
