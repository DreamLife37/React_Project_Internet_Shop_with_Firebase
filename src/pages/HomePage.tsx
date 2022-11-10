import {Link, Navigate} from 'react-router-dom'
import React, {useEffect} from 'react'
import {useAuth} from "../hooks/use-auth";
import {removeAuthData} from "../store/slices/authSlice";
import {useAppDispatch, useAppSelector} from '../hooks/redux-hooks';
import {ProductInCatalog,} from '../components/ProductInCatalog/ProductInCatalog';
import {fetchAllProductsTC, fetchDataCartTC} from "../store/slices/productSlice";
import s from './HomePage.module.css'
import {Preloader} from "../components/preloader/Preloader";

export type AddToCartType = {
    title: string,
    itemId: string,
    price: number,
    image: string,
    count: number
}

export const HomePage = () => {
    const {isAuth, id} = useAuth()
    const dispatch = useAppDispatch()
    const products = useAppSelector(state => state.products.products)
    const isLoading = useAppSelector(state => state.app.isLoading)
    const error = useAppSelector(state => state.app.error)
    const cart = useAppSelector(state => state.products.cart)
    const amountCart = useAppSelector(state => state.products.cart.amount)

    const handlerLogout = () => {
        dispatch(removeAuthData())
    }

    useEffect(() => {
        if (isAuth) {
            dispatch(fetchAllProductsTC())
        }
    }, [])

    useEffect(() => {
        if (id != null) {
            dispatch(fetchDataCartTC({userId: id}))
        }
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        {isLoading && <Preloader/>}
        <h1>Home page</h1>
        <Link to={'/cart'}>
            <div>{`Корзина ${amountCart > 0 ? amountCart : ''}`}</div>
        </Link>

        <Link to={'/myorders'}>
            <div>{`Мои заказы`}</div>
        </Link>

        <div>
            <button onClick={handlerLogout}>Log out</button>
        </div>
        <div className={s.container}>{products.map(p => {
            return <ProductInCatalog key={p.id} title={p.title} id={p.id} availability={p.availability} image={p.image}
                                     price={p.price}/>
        })}</div>
    </div>
}