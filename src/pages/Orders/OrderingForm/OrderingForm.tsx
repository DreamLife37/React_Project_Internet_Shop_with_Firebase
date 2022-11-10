import React, {useState} from "react";
import {useFormik} from "formik";
import style from './Ordering.module.css'
import {removeAllItemCartTC, sendOrderTC} from "../../../store/slices/productSlice";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from "../../../hooks/use-auth";
import { useNavigate } from 'react-router-dom';

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
        <form onSubmit={formik.handleSubmit} className={style.form}>
            <input {...formik.getFieldProps('name')} className={style.input} placeholder={'Имя'}
            />
            {formik.touched.name && formik.errors.name
                ? <div style={{color: '#9d1717', fontSize: '14px'}}>{formik.errors.name}</div>
                : null}
            <input
                {...formik.getFieldProps('email')} className={style.input} placeholder={'Email'}
            />
            {formik.touched.email && formik.errors.email
                ? <div style={{color: '#9d1717', fontSize: '14px'}}>{formik.errors.email}</div>
                : null}

            <textarea {...formik.getFieldProps('phone')} placeholder={'Телефон'} name="phone"
                      className={style.textarea}/>
            {formik.touched.phone && formik.errors.phone
                ? <div style={{color: '#ffffff', fontSize: '12px'}}>{formik.errors.phone}</div>
                : null}

            <button type={'submit'} className={style.button}
                    disabled={disabledButton}>
                {'Оформить заказ'}
            </button>
        </form>

    </div>
}