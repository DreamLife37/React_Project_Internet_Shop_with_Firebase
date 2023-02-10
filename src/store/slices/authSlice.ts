import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setAppStatus} from "./appSlice";
import {getAuth, signOut} from "firebase/auth";
import {handleServerNetworkError} from "../../utils/errorUtitls";
import {getStoreLocal} from "../../utils/localStorage";

export const logoutTC = createAsyncThunk(
    'product/logout',
    async (_, {dispatch}) => {
        dispatch(setAppStatus({status: "loading"}))
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                if (navigator.onLine) {
                    dispatch(removeAuthData())
                    localStorage.removeItem('email')
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    throw new Error("No Internet")
                }
            }).catch((error) => {
            handleServerNetworkError(dispatch)
        })
    })


type AuthDataType = {
    email: null | string,
    token: null | string,
    id: null | string
}

const initialState = {
    email: getStoreLocal('email'),
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
            },
        }
    })

export const {setAuthData, removeAuthData} = authSlice.actions
export const authReducer = authSlice.reducer

function removeUserData() {
    throw new Error("Function not implemented.");
}
