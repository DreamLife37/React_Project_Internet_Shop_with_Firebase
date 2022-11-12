import s from './Cart.module.css'
import {fetchDataCartTC, fetchDataOrdersTC} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";
import {OrderingForm} from "../Orders/OrderingForm/OrderingForm";

export const Cart = () => {
    const {id, isAuth} = useAuth()
    const dispatch = useAppDispatch()

    const cart = useAppSelector(state => state.products.cart)
    console.log(cart.items)
    const amountCart = useAppSelector(state => state.products.cart.amount)

    useEffect(() => {
        if (id != null) {
            dispatch(fetchDataCartTC({userId: id}))
            dispatch(fetchDataOrdersTC())
        }
    }, [])


    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    let cartOrder = cart.items.map((i) => {
        return {
            name: i.title, price: i.price, count: i.count,
        }
    })

    return <div className={s.container}>
        <div className={s.cart}>
            {
                cart.items.length
                    ? cart.items.map((i) => {
                        return <ItemCart key={i.idItem}
                                         idItem={i.idItem}
                                         image={i.image}
                                         price={i.price}
                                         title={i.title}
                                         count={i.count}
                                         amount={i.price * i.count}
                                         availability={i.availability}
                        />
                    })
                    : <div>Корзина пуста</div>
            }

            {cart.items.length > 0 && <div>{`Сумма ${amountCart} $`}</div>}
        </div>
        <div className={s.order}><OrderingForm cartOrder={cartOrder}/></div>
    </div>
}