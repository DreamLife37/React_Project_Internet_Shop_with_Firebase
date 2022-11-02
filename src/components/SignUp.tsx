import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {Form} from "./Form";
import {setAuthData} from "../app/slices/authSlice";
import {useAppDispatch} from "../app/store";
import {useNavigate} from "react-router-dom";
import React from "react";



export const SignUp = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const handleRegister = (email: string, password: string) => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(({user})=>{
                console.log(user)
                // @ts-ignore
                dispatch(setAuthData({email:user.email, token: user.accessToken,id:user.uid}))
                return navigation("/")
            })
            .catch(console.error)
    }
    return <div>
        <Form title={'Sign up'} handleClick={handleRegister}/>
    </div>
}