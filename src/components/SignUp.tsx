import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {Form} from "./formAuth/Form";
import {setAuthData} from "../store/slices/authSlice";
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {useAppDispatch} from "../hooks/redux-hooks";
import firebase from "firebase/app";
import {setAppError} from "../store/slices/appSlice";

export const SignUp = () => {
    const dispatch = useAppDispatch()
    const navigation = useNavigate()
    const handleRegister = (email: string, password: string) => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(({user}) => {
                dispatch(setAuthData({email: user.email, token: user.refreshToken, id: user.uid}))
                return navigation("/")
            })
            .catch((err: firebase.FirebaseError) => {
                console.log(err)
                if (err.code === 'auth/email-already-in-use') {
                    dispatch(setAppError({
                        error: {
                            messageError: `Пользователь с таким e-mail уже существует`,
                            typeError: 'error'
                        }
                    }))
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