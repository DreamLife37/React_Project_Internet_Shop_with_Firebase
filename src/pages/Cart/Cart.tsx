import s from './Cart.module.css'
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import {setDataCart, setDataProducts} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";

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
            const cartRef = doc(db, '/cart', id)
            const unsubscribe = onSnapshot(cartRef, (itemCart) => {
                if (itemCart.exists()) {
                    console.log(itemCart.data().cart)
                    //setCart(ItemCart.data().cart)
                    debugger
                    dispatch(setDataCart(itemCart.data().cart))
                } else {
                    console.log("No items in Cart")
                }
                //dispatch(setDataProducts(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))));
                // console.log(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
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

    // useEffect(() => {
    //     if (id != null) {
    //         const cartRef = doc(collection(db, '/cart', id))
    //         const unsubscribe = onSnapshot(cartRef, (ItemCart) => {
    //             if (ItemCart.exists()) {
    //                 console.log(ItemCart.data().coins)
    //                 setCart(ItemCart.data().coins)
    //             } else {
    //                 console.log("No items in Cart")
    //             }
    //             //dispatch(setDataProducts(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))));
    //             // console.log(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    //         });
    //         return () => {
    //             unsubscribe()
    //         }
    //     }
    // }, [id])


    //dispatch(setAppStatusAC({isLoading: false}))

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