import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Form} from "./formAuth/Form";
import {setAuthData} from "../store/slices/authSlice";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useAppDispatch} from "../hooks/redux-hooks";
import {setAppError, setAppStatus} from "../store/slices/appSlice";
import firebase from 'firebase/app';
import {saveToStorage} from "../utils/localStorage";

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
        dispatch(setAppStatus({status: "loading"}))
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(setAuthData({email: user.email, token: user.refreshToken, id: user.uid}))
                saveToStorage(email)
                dispatch(setAppStatus({status: "idle"}))
                return navigation("/")
            })
            .catch((err: firebase.FirebaseError) => {
                dispatch(setAppStatus({status: "failed"}))
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                    dispatch(setAppError({error: {messageError: `Не верный логин или пароль`, typeError: 'error'}}))
                } else {
                    dispatch(setAppError({error: {messageError: `Ошибка`, typeError: 'error'}}))
                }
            })
            .finally(() => {
                dispatch(setAppStatus({status: "idle"}))
            })
    }

    return <div>
        <Form title={'Войти'} handleClick={handleLogin}>{
            <>
                <div>Не имеете аккаунта?</div>
                <div><Link to={'/register'}>Регистрация</Link></div>
            </>
        }</Form>
    </div>
}