import {Navigate} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import {useAuth} from "../hooks/use-auth";
import {removeAuthData} from "../app/slices/authSlice";
import {useAppDispatch, useAppSelector} from '../hooks/redux-hooks';
import {collection, query, onSnapshot, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from '../firebase';
import {ProductInCatalog, ProductInCatalogType} from '../components/ProductInCatalog/ProductInCatalog';
import {fetchAllProductsTC, setDataProducts} from "../app/slices/productSlice";

export const HomePage = () => {
    const {isAuth} = useAuth()
    const dispatch = useAppDispatch()
    const products = useAppSelector(state => state.products.products)

    useEffect(() => {
        dispatch(fetchAllProductsTC())
    }, [])

    // const data = async () => {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // }

    const handlerLogout = () => {
        dispatch(removeAuthData())
    }

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    return <div>
        <h1>Home page</h1>
        <button onClick={handlerLogout}>Log out</button>
        {/*<ProductInCatalog products={products}/>*/}
        <>{products.map(product => {
            // @ts-ignore
            return <div>{product.title}</div>
        })}</>

    </div>
}