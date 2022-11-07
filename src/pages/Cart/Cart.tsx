import s from './Cart.module.css'
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import {setDataCart, setDataProducts} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";
import {setAppStatus} from "../../store/slices/appSlice";

export type ItemCartType = {
    image: string,
    title: string,
    idItem: string,
    price: number,
    count: number,
}

export const Cart = () => {

    const {id, isAuth} = useAuth()
    const dispatch = useAppDispatch()

    const cart = useAppSelector(state => state.products.cart)
    console.log(cart)


    useEffect(() => {
        if (id != null) {
            dispatch(setAppStatus({isLoading: true}))
            const cartRef = doc(db, '/cart', id)
            const unsubscribe = onSnapshot(cartRef, (itemCart) => {
                if (itemCart.exists()) {
                    dispatch(setDataCart(itemCart.data().cart))
                    dispatch(setAppStatus({isLoading: false}))
                } else {
                    console.log("No items in Cart")
                }
            });
            return () => {
                unsubscribe()
            }
        }
    }, [])


    let total = 0;
    for (let i in cart.items) {
        total += cart.items[i].price * cart.items[i].count;
    }

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div className={s.container}>
        <div className={s.cart}>
            <Link to={'/'}>На домашнюю страницу</Link>
            {cart.items.map((i) => {
                return <ItemCart key={i.idItem}
                                 idItem={i.idItem}
                                 image={i.image}
                                 price={i.price}
                                 title={i.title}
                                 count={i.count}
                                 amount={i.price * i.count}
                />
            })}

            <div>Сумма {total}

            </div>
        </div>
        <div className={s.order}>
            <input placeholder={'Имя'}/>
            <input placeholder={'Фамилия'}/>
            <input placeholder={'Адрес'}/>
            <input placeholder={'Номер телефона'}/>
            <button>Оформить</button>
        </div>
    </div>
}