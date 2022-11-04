import {Link, Navigate} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import {useAuth} from "../hooks/use-auth";
import {removeAuthData} from "../store/slices/authSlice";
import {useAppDispatch, useAppSelector} from '../hooks/redux-hooks';
import {collection, query, onSnapshot, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {db} from '../firebase';
import {ProductInCatalog, ProductInCatalogType} from '../components/ProductInCatalog/ProductInCatalog';
import {addToCartTC, fetchAllProductsTC, setDataCart, setDataProducts} from "../store/slices/productSlice";
import s from './HomePage.module.css'


export type AddToCartType = {
    title: string,
    idItem: string,
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

    // const data = async () => {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // }

    const cart = useAppSelector(state => state.products.cart.items)
    //const [cart, setCart] = useState([])
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
    }, [id])


    const addToCart = async (payload: AddToCartType) => {
        if (id != null) {
            const cartRef = doc(db, 'cart', id)
            try {
                await setDoc(cartRef,
                    {
                        cart: cart
                            ? [...cart,
                                {
                                    title: payload.title,
                                    idItem: payload.idItem,
                                    price: payload.price,
                                    image: payload.image,
                                    count: payload.count
                                }]
                            : []
                    },
                    {merge: true})
            } catch (e) {
            }
        }

        //dispatch(addToCartTC({idItem: '3'}))
    }


    // const addToCart = () => {
    //     debugger
    //     dispatch(addToCartTC({idItem: '576767676767'}))
    // }

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

        {/*<button onClick={addToCart}>Create Data</button>*/}

        <div className={s.container}>{products.map(p => {
            return <ProductInCatalog key={p.id} title={p.title} id={p.id} availability={p.availability} image={p.image}
                                     price={p.price} addToCart={addToCart}/>
        })}</div>
    </div>
}