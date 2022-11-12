import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {fetchDataOrdersTC} from "../../../store/slices/productSlice";
import {Link, Navigate} from "react-router-dom";
import {useAuth} from "../../../hooks/use-auth";
import s from './MyOrders.module.css'

export const MyOrders = () => {
    const dispatch = useAppDispatch()
    const {isAuth, id} = useAuth()
    const orders = useAppSelector(state => state.products.orders)
    console.log(orders)

    useEffect(() => {
        dispatch(fetchDataOrdersTC())
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        <h2>Мои заказы</h2>
        {orders.length
            ? orders.map((order, index) =>
                <div key={index}>
                    <h3>{`Заказ ${index + 1}`}</h3>
                    {order.items.map((i, key) =>
                        <div key={key}><span>{key + 1}</span>
                            <span className={s.item}>{i.name}</span>
                            <span className={s.item}>{i.price} $</span>
                            <span className={s.item}>{i.count} шт</span>
                        </div>)
                    }
                    <div>Сумма заказа: {order.amountCart}</div>
                </div>)
            : <div>Список заказов пуст</div>}
    </div>
}
