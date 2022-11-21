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
    const isInitialized = useAppSelector(state => state.app.isInitialized)


    const handlerLogout = () => {
        dispatch(removeAuthData())
    }

    useEffect(() => {
        if (id != null || isAuth) {
            dispatch(fetchAllProductsTC())
            dispatch(fetchDataCartTC({userId: id}))
                // .then((res)=>{
                //     if (res.meta.requestStatus === "fulfilled") {
                //         console.log(res)
                //         // dispatch(initializeApp())
                //     }
                // })
        }
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        {isAuth ? (!isInitialized ? <Preloader/> : '') : ''}
        <h1 className={s.title}>Главная</h1>

        <div className={s.container}>{products.map(p => {
            return <ProductInCatalog key={p.id} title={p.title} id={p.id} availability={p.availability} image={p.image}
                                     price={p.price}/>
        })}</div>
    </div>
}