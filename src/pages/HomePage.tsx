import {Link, Navigate} from 'react-router-dom'
import React, {useEffect} from 'react'
import {useAuth} from "../hooks/use-auth";
import {removeAuthData} from "../store/slices/authSlice";
import {useAppDispatch, useAppSelector} from '../hooks/redux-hooks';
import {ProductInCatalog,} from '../components/ProductInCatalog/ProductInCatalog';
import {fetchAllProductsTC} from "../store/slices/productSlice";
import s from './HomePage.module.css'


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

    useEffect(() => {
        dispatch(fetchAllProductsTC())
    }, [])

    const handlerLogout = () => {
        dispatch(removeAuthData())
    }

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        <h1>Home page</h1>
        <Link to={'/cart'}>Корзина</Link>
        <div>
            <button onClick={handlerLogout}>Log out</button>
        </div>

        <div className={s.container}>{products.map(p => {

            return <ProductInCatalog key={p.id} title={p.title} id={p.id} availability={p.availability} image={p.image}
                                     price={p.price}/>
        })}</div>
    </div>
}