import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {Form} from "./Form";
import {setAuthData} from "../store/slices/authSlice";
import {useNavigate} from "react-router-dom";
import React from "react";
import { useAppDispatch } from "../hooks/redux-hooks";

export const SignUp = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const handleRegister = (email: string, password: string) => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(({user})=>{
                dispatch(setAuthData({email:user.email, token: user.refreshToken,id:user.uid}))
                return navigation("/")
            })
            .catch(console.error)
    }
    return <div>
        <Form title={'Sign up'} handleClick={handleRegister}/>
    </div>
}