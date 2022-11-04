import s from './Cart.module.css'
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {db} from "../../firebase";
import {setDataProducts} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";

export type ItemCartType = {
    image: string,
    title: string,
    idItem: string,
    price: number,
    count: number
}

export const Cart = () => {

    const {id, isAuth} = useAuth()

    const cart = useAppSelector(state => state.products.cart)
    console.log(cart)


    let total = 0;
    for (let i in cart.items) {
        total += cart.items[i].price;
    }
    console.log(total)

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
                let amount1 = +i.price
                console.log(amount1)
                return <ItemCart key={i.idItem}
                                 idItem={i.idItem}
                                 image={i.image}
                                 price={i.price}
                                 title={i.title}
                                 count={i.count}/>

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