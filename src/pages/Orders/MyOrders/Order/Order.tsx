import React, {FC, useEffect} from "react";
import {Navigate} from "react-router-dom";
import s from './Order.module.css'
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux-hooks";
import {useAuth} from "../../../../hooks/use-auth";
import {fetchDataOrdersTC, OrderModelType} from "../../../../store/slices/productSlice";

type OrderPropsType = {
    order?: OrderModelType
}

export const Order: FC<OrderPropsType> = ({order}) => {
    const dispatch = useAppDispatch()
    const {isAuth, id} = useAuth()
    const orders = useAppSelector(state => state.products.orders)
    // console.log(orders)


    useEffect(() => {
        dispatch(fetchDataOrdersTC())
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div className={s.container}>
        <h2 className={s.title}>Заказ</h2>
        {orders[28] && <div>
            <h3 className={s.title}>{`Заказ ${222}`}</h3>
            <div className={s.items}>{orders[28].items.map((i, key) =>
                <div key={key}>
                    <span className={s.text}>{key + 1}</span>
                    <span className={s.text}>{i.name}</span>
                    <span className={s.text}>{i.price} $</span>
                    <span className={s.text}>{i.count} шт</span>
                </div>)
            }</div>
            {/*<div className={s.amountCart}>Сумма заказа: {order.amountCart} $</div>*/}
        </div>
        }
    </div>
}
