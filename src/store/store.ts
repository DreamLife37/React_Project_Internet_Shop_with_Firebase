import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {productReducer} from "./slices/productSlice";

export const store = configureStore({
    reducer: {auth: authReducer, products: productReducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

// @ts-ignore
window.store = store
