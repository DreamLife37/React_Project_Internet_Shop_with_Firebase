import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({authReducer})

export const store = configureStore({
    reducer: {auth: authReducer}
})



export type RootReducerType = typeof rootReducer

export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store
