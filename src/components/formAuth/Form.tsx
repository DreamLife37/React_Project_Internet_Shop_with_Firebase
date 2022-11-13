import React, {useState, FC} from "react"
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import s from './Form.module.css'
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAppError} from "../../store/slices/appSlice";

type FormType = {
    children: React.ReactNode,
    title: string,
    handleClick: (email: string, password: string) => void
}

type FormikErrorType = {
    login?: string
    password?: string
}

export const Form: FC<FormType> = ({children, title, handleClick}) => {

    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector(state => state.app.isLoading)
    console.log(isLoading)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formik = useFormik({
        initialValues: {
            login: '',
            password: '',
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

            if (!values.login) {
                errors.login = 'Поле обязательно';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.login)) {
                errors.login = 'Не верно указан e-mail';
            }
            if (!values.password) {
                errors.password = 'Поле обязательно';
            } else if (values.password.length < 6) {
                errors.password = 'Минимальный пароль 6 символов';
            }
            return errors;
        },
        onSubmit: async values => {
            if (navigator.onLine) {
                handleClick(values.login, values.password)
            } else {
                dispatch(setAppError({error: {messageError: "Проверьте доступ к интернет", typeError: 'error'}}))
            }
        },
    })

    const disabledButton = (!formik.values.login || !!formik.errors.password || isLoading)

    return <Box className={s.container}>
        <form onSubmit={formik.handleSubmit} className={s.form}>

            <FormControl sx={{m: 1, width: '25ch', height: '70px'}} variant="outlined">
                <TextField
                    {...formik.getFieldProps('login')} placeholder={'E-mail'}
                    error={formik.touched.login && Boolean(formik.errors.login)}
                    helperText={formik.touched.login && formik.errors.login}
                />
            </FormControl>

            <FormControl sx={{m: 1, width: '25ch', height: '70px'}} variant="outlined">
                <TextField
                    {...formik.getFieldProps('password')} placeholder={'Пароль'}
                    type={showPassword ? 'text' : 'password'}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={
                        {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }
                />
            </FormControl>

            <div className={s.button}>
                <Button disabled={disabledButton} variant="contained"
                        type={'submit'}>{title}</Button>
            </div>

            <div className={s.text}>
                {children}
            </div>
        </form>
    </Box>
}