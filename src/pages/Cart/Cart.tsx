import s from './Cart.module.css'
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import {fetchDataCartTC, setAmountCart, setDataCart} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";
import {setAppStatus} from "../../store/slices/appSlice";

export const Cart = () => {
    const {id, isAuth} = useAuth()
    const dispatch = useAppDispatch()

    const cart = useAppSelector(state => state.products.cart)
    const amountCart = useAppSelector(state => state.products.cart.amount)

    useEffect(() => {
        if (id != null) {
            dispatch(fetchDataCartTC({userId: id}))
        }
    }, [])



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
                                 availability={i.availability}
                />
            })}

            <div>{`Сумма ${amountCart}`}

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