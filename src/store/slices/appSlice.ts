import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateType = {
    status: RequestStatusType
    isLoading: boolean,
    isInitialized: boolean,
    error: {
        messageError: null | string,
        typeError: 'warning' | 'error' | 'info' | 'success'
    }
}

const initialState = {
    status: "idle",
    isInitialized: false,
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
        initializeApp(state) {
            state.isInitialized = true
        },
        setAppError(state, action) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
    }
})
export const {setAppStatus, setAppError, initializeApp} = appSlice.actions
export const appReducer = appSlice.reducer
