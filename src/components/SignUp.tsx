import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {Form} from "./formAuth/Form";
import {setAuthData} from "../store/slices/authSlice";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useAppDispatch} from "../hooks/redux-hooks";
import firebase from "firebase/app";
import {setAppError, setAppStatus} from "../store/slices/appSlice";

export const SignUp = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()

    const handleRegister = (email: string, password: string) => {
        dispatch(setAppStatus({status: "loading"}))
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                if (user.email) {
                    dispatch(setAuthData({email: user.email, token: user.refreshToken, id: user.uid}))
                    dispatch(setAppStatus({status: "idle"}))
                    return navigation("/")
                }
            })
            .catch((err: firebase.FirebaseError) => {
                dispatch(setAppStatus({status: "failed"}))
                if (err.code === 'auth/email-already-in-use') {
                    dispatch(setAppError({
                        error: {
                            messageError: `Пользователь с таким e-mail уже существует`,
                            typeError: 'error'
                        }
                    }))
                    return
                }
                if (err.code === 'auth/weak-password') {
                    dispatch(setAppError({error: {messageError: `Минимальный пароль 6 символов`, typeError: 'error'}}))
                } else {
                    dispatch(setAppError({error: {messageError: `Ошибка`, typeError: 'error'}}))
                }
            })
    }
    return <div>
        <Form title={'Регистрация'} handleClick={handleRegister}>{
            <>
                <div>Имеется аккаунт?</div>
                <div><Link to={'/login'}>Войти</Link></div>
            </>
        }</Form>
    </div>
}