import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {fetchDataOrdersTC, setSelectedOrder} from "../../../store/slices/productSlice";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth} from "../../../hooks/use-auth";
import s from './MyOrders.module.css'
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const MyOrders = () => {
    const dispatch = useAppDispatch()
    const {isAuth} = useAuth()
    const orders = useAppSelector(state => state.products.orders)
    const navigation = useNavigate()

    useEffect(() => {
        dispatch(fetchDataOrdersTC())
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    const handleOrder = (selectedOrderId: string) => {
        dispatch(setSelectedOrder(selectedOrderId))
        navigation('/myOrders/order/')
    }

    return <div className={s.container}>
        <h2 className={s.title}>Мои заказы</h2>
        <div className={s.tableHeader}>
            <div className={s.tableHeaderItem}>№</div>
            <div className={s.tableHeaderStatus}>Статус</div>
            <div className={s.tableHeaderDate}>Дата</div>
            <div className={s.tableHeaderItem}>Сумма</div>
            <div className={s.tableHeaderItem}></div>
        </div>
        {orders.length
            ? orders.map((order, index) => {
                let dateTransform = new Date(+order.date * 1000).toLocaleString()
                return <div className={s.orderWrapper} key={index}>
                    <div className={s.item}>{`Заказ ${index + 1}`}
                        <div>#{order.orderId}</div>
                    </div>
                    <div className={s.item}>{`Создан`}</div>
                    <div className={s.item}>{`${dateTransform}`}</div>
                    <div className={s.amountCart}>{order.amountCart} $</div>
                    <div className={s.amountCart}>
                        <IconButton aria-label="arrow-forward" className={s.text}
                                    onClick={() => handleOrder(order.orderId)}>
                            <ArrowForwardIcon style={{color: "#4E97FD"}}/>
                        </IconButton>
                    </div>
                </div>
            })

            : <div className={s.emptyCart}>Список заказов пуст</div>}
    </div>
}
