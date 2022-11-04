import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Form} from "./Form";
import {setAuthData} from "../store/slices/authSlice";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useAppDispatch} from "../hooks/redux-hooks";

export type ResponseType = {
    accessToken: string
    email: string
    emailVerified: boolean
    uid: string
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const handleLogin = (email: string, password: string) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(setAuthData({email: user.email, token: user.refreshToken, id: user.uid}))
                return navigation("/")
            })
            .catch(console.error)
    }
    return <div>
        <Form title={'Sign in'} handleClick={handleLogin}/>
    </div>
}