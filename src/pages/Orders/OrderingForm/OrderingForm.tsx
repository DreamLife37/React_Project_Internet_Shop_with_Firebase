import React, {useState} from "react";
import {useFormik} from "formik";
import s from './Ordering.module.css'
import {removeAllItemCartTC, sendOrderTC} from "../../../store/slices/productSlice";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from "../../../hooks/use-auth";
import {useNavigate} from 'react-router-dom';
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";

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
        //amountCart: number
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
                dispatch(sendOrderTC({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    amountCart: amountCart,
                    cartOrder: cartOrder
                })).then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                        dispatch(removeAllItemCartTC({userId: id}))
                        navigate('/successfulOrder');
                    }
                })

                // setSendingStatus('loading')
                // API.sendMessage(values)
                //     .then((res) => {
                //         if (res.statusText === 'OK') {
                //             formik.resetForm()
                //             setSendingStatus('success')
                //         } else setSendingStatus('error')
                //     })
                //     .catch((err) => {
                //         setSendingStatus('error')
                //     })
            } else {
                // setSendingStatus('error')
            }
        },
    })

    const disabledButton = (!formik.values.email || !formik.values.name || !formik.values.phone || !!formik.errors.email)

    return <div>
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
                <Button type={'submit'} disabled={disabledButton}
                        variant="contained">{'Оформить заказ'}</Button>
            </div>

        </form>
    </div>
}