import React from "react";
import {useFormik} from "formik";
import s from './Ordering.module.css'
import {removeAllItemCartTC, sendOrderTC} from "../../../store/slices/productSlice";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from "../../../hooks/use-auth";
import {useNavigate} from 'react-router-dom';
import FormControl from "@mui/material/FormControl";
import {TextField} from "@mui/material";
import {setAppError, setAppStatus} from "../../../store/slices/appSlice";
import Box from "@mui/material/Box";
import {ButtonWithLoading} from "../../../components/ButtonWithLoading/ButtonWithLoading";

type FormikErrorType = {
    name?: string
    email?: string
    phone?: string
}

type OrderFormType = {
    cartOrder: Array<{
        name: string
        price: number
        count: number
        image: string
    }>
}

export const OrderingForm: React.FC<OrderFormType> = ({
                                                          cartOrder
                                                      }) => {
    const dispatch = useAppDispatch()
    const amountCart = useAppSelector(state => state.products.cart.amount)

    const {id} = useAuth()

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: ''
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.name) {
                errors.name = 'Поле обязательно';
            }
            if (!values.email) {
                errors.email = 'Поле обязательно';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Не верно указан e-mail';
            }
            if (!values.phone) {
                errors.phone = 'Поле обязательно';
            }
            return errors;
        },
        onSubmit: async values => {
            if (navigator.onLine) {
                debugger
                dispatch(setAppStatus({status: "loading"}))
                if (cartOrder.length > 0) {
                    dispatch(sendOrderTC({
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        amountCart: amountCart,
                        cartOrder: cartOrder
                    }))
                        .then((res) => {
                            if (res.meta.requestStatus === "fulfilled") {
                                debugger
                                dispatch(setAppStatus({status: "idle"}))
                                dispatch(removeAllItemCartTC({userId: id}))
                                navigate('/successfulOrder');
                            } else {
                                dispatch(setAppError({
                                    error: {
                                        messageError: `Заказ не оформлен, повторите попытку`,
                                        typeError: 'error'
                                    }
                                }))
                            }
                        })
                        .catch(() => {
                            dispatch(setAppStatus({status: "failed"}))
                            dispatch(setAppError({
                                error: {
                                    messageError: `Заказ не оформлен, повторите попытку`,
                                    typeError: 'error'
                                }
                            }))
                        })
                } else {
                    dispatch(setAppError({
                        error: {
                            messageError: `Невозможно оформить заказ с пустой корзиной`,
                            typeError: 'warning'
                        }
                    }))
                    dispatch(setAppStatus({status: "failed"}))
                }
            } else {
                dispatch(setAppError({error: {messageError: "Проверьте доступ к интернет", typeError: 'error'}}))
                dispatch(setAppStatus({status: "failed"}))
            }
        },
    })

    const disabledButton = (!formik.values.email || !formik.values.name || !formik.values.phone || !!formik.errors.email)

    return <Box className={s.container}>
        <form onSubmit={formik.handleSubmit} className={s.form}>

            <FormControl sx={{m: 1, width: '20ch', height: '70px'}} variant="outlined">
                <TextField
                    {...formik.getFieldProps('name')} placeholder={'Имя'}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
            </FormControl>

            <FormControl sx={{m: 1, width: '20ch', height: '70px'}} variant="outlined">
                <TextField
                    {...formik.getFieldProps('email')} placeholder={'Email'}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}

                />
            </FormControl>

            <FormControl sx={{m: 1, width: '20ch', height: '70px'}} variant="outlined">
                <TextField
                    {...formik.getFieldProps('phone')} placeholder={'Телефон'} name="phone"
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                />
            </FormControl>

            <div className={s.button}>
                <ButtonWithLoading title={'Оформить заказ'} disabledButton={disabledButton}/>
            </div>

        </form>
    </Box>
}