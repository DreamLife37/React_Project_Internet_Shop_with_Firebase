import {Navigate} from 'react-router-dom'
import React from 'react'
import {useAuth} from "../hooks/use-auth";
import {useAppDispatch} from "../app/store";
import {removeAuthData} from "../app/slices/authSlice";

export const HomePage = () => {
    const {isAuth} = useAuth()
    const dispatch = useAppDispatch()

    const handlerLogout = () => {
        dispatch(removeAuthData())
    }

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        <h1>Home page</h1>
        <button onClick={handlerLogout}>Log out</button>
    </div>
}