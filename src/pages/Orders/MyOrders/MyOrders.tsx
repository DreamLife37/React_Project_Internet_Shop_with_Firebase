import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {fetchDataOrdersTC, OrderModelType, setSelectedOrder} from "../../../store/slices/productSlice";
import {Link, Navigate, NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../../hooks/use-auth";
import s from './MyOrders.module.css'
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {serverTimestamp, Timestamp} from "firebase/firestore";
import {Order} from "./Order/Order";


export const MyOrders = () => {
    const dispatch = useAppDispatch()
    const {isAuth, id} = useAuth()
    const orders = useAppSelector(state => state.products.orders)
    // console.log(orders[29].date)
    const navigation = useNavigate()
    const selectedOrderId = useAppSelector(state => state.products.selectedOrderId)
    if (!!selectedOrderId) {
        console.log(selectedOrderId)
    }

    // const [currentOrder, setCurrentOrder] = useState()

    useEffect(() => {
        dispatch(fetchDataOrdersTC())
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    const handleOrder = (selectedOrderId: string) => {
        console.log(selectedOrderId)
        // let orderId = order.
        dispatch(setSelectedOrder(selectedOrderId))
        navigation('/myOrders/order/')
        // setCurrentOrder()
        return <Order/>
    }

    return <div className={s.container}>

        <h2 className={s.title}>Мои заказы</h2>
        <div className={s.tableHeader}>
            <div className={s.tableHeaderItem}>№ заказа</div>
            <div className={s.tableHeaderItem}>Статус</div>
            <div className={s.tableHeaderItem}>Дата создания</div>
            <div className={s.tableHeaderItem}>Сумма заказа</div>
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


            : <div>Список заказов пуст</div>}
    </div>
}
