import React, {useState, FC} from "react"
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import s from './Form.module.css'
import {TextField} from "@mui/material";
import {useFormik} from "formik";
import {removeAllItemCartTC, sendOrderTC} from "../../store/slices/productSlice";

type FormType = {
    children: React.ReactNode,
    title: string,
    handleClick: (email: string, password: string) => void
}

interface State {
    login: string;
    password: string;
    showPassword: boolean;
}

type FormikErrorType = {
    login?: string
    password?: string
}

export const Form: FC<FormType> = ({children, title, handleClick}) => {
    // const [error1, setError] = useState<Error>({
    //     login: '',
    //     password: '',
    // });

    const [values, setValues] = useState<State>({
        login: '',
        password: '',
        showPassword: false,
    });

    // const validate = () => {
    //     if (values.login.length < 3) {
    //         setError({...error1, login: 'Не корректный e-mail'})
    //     }
    // }

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickButtonSubmit = () => {
        let email = values.login
        let password = values.password
        console.log(email)
        handleClick(email, password)
    }

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
            }
            return errors;
        },
        onSubmit: async values => {
            if (navigator.onLine) {

                handleClickButtonSubmit()

                // dispatch(sendOrderTC({
                //     name: values.name,
                //     email: values.email,
                //     phone: values.phone,
                //     amountCart: amountCart,
                //     cartOrder: cartOrder
                // })).then((res) => {
                //     if (res.meta.requestStatus === "fulfilled") {
                //         dispatch(removeAllItemCartTC({userId: id}))
                //         navigate('/successfulOrder');
                //     }
                // })
            } else {
                // setSendingStatus('error')
            }
        },
    })

    const disabledButton = (!formik.values.login || !!formik.errors.password)


    return <Box className={s.container}>
        <FormControl sx={{m: 1, width: '25ch'}} variant="outlined">
            <TextField
                {...formik.getFieldProps('login')} placeholder={'E-mail'}
                error={formik.touched.login && Boolean(formik.errors.login)}
                helperText={formik.touched.login && formik.errors.login}
            />
            <InputLabel htmlFor="login">E-mail</InputLabel>
            {/*<OutlinedInput*/}
            {/*    id="login"*/}
            {/*    type={'text'}*/}
            {/*    value={values.login}*/}
            {/*    onChange={handleChange('login')}*/}
            {/*    label="E-mail"*/}
            {/*    className={s.inputForm}*/}
            {/*    //onBlur={() => validate()}*/}
            {/*/>*/}
        </FormControl>

        <FormControl sx={{m: 1, width: '25ch'}} variant="outlined">
            <TextField
                {...formik.getFieldProps('password')} placeholder={'Пароль'}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
            <OutlinedInput
                error
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                }
                label="Пароль"
            />
        </FormControl>

        <Button className={s.button} variant="contained" onClick={handleClickButtonSubmit}>{title}</Button>

        <div className={s.text}>
            {children}
        </div>
    </Box>
}