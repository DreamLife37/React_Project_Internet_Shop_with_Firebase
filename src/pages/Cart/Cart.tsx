import s from './Cart.module.css'
import {fetchDataCartTC, fetchDataOrdersTC} from "../../store/slices/productSlice";
import {useAuth} from "../../hooks/use-auth";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {ItemCart} from "./ItemCart/ItemCart";
import {Link, Navigate} from "react-router-dom";
import {OrderingForm} from "./OrderingForm/OrderingForm";
import Box from "@mui/material/Box";
import {CircularProgress, LinearProgress} from "@mui/material";

export const Cart = () => {
    const {id, isAuth} = useAuth()
    const dispatch = useAppDispatch()

    const cart = useAppSelector(state => state.products.cart)
    const appStatus = useAppSelector(state => state.app.status)

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
            name: i.title, price: i.price, count: i.count, image: i.image
        }
    })

    return <div className={s.container}>
        {appStatus === 'loading' && <Box sx={{display: 'flex'}}>
            <LinearProgress/>
        </Box>}
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

            {cart.items.length > 0 && <div className={s.titleAmountCart}>Сумма:
                <span className={s.amountCart}>{`${amountCart} $`}</span>
            </div>}
        </div>
        <div className={s.order}><OrderingForm cartOrder={cartOrder}/></div>
    </div>
}