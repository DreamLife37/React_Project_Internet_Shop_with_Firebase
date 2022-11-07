import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type AuthDataType = {
    email: null | string,
    token: null | string,
    id: null | string
}

const initialState = {
    email: null,
    token: null,
    id: null
} as AuthDataType

const
    authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
            setAuthData(state, action: PayloadAction<AuthDataType>) {
                state.email = action.payload.email
                state.token = action.payload.token
                state.id = action.payload.id
            },
            removeAuthData(state) {
                state.email = null
                state.token = null
                state.id = null
            }
        }
    })

export const {setAuthData, removeAuthData} = authSlice.actions
export const authReducer = authSlice.reducer