import s from './ProductInCatalog.module.css'
import {FC, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {addToCartTC, setAmountCart, updateItemCartTC} from "../../store/slices/productSlice";
import {setAppError} from "../../store/slices/appSlice";

export type ProductInCatalogType = {
    availability: number
    price: number
    image: string
    title: string
    id: string
}

export const ProductInCatalog: FC<ProductInCatalogType> = ({
                                                               availability,
                                                               price,
                                                               image,
                                                               title,
                                                               id,
                                                           }) => {
    const itemsCart = useAppSelector(state => state.products.cart.items)
    const userId = useAppSelector(state => state.auth.id)
    const dispatch = useAppDispatch()

    const addToCartHandler = () => {
        let currentItemCart = itemsCart.find((i) => i.idItem === id)
        if (currentItemCart && (currentItemCart.count >= availability)) {
            dispatch(setAppError({error: `На складе доступно ${availability}`}))
        } else {
            if (!!currentItemCart) {
                dispatch(updateItemCartTC({itemId: id, count: currentItemCart.count + 1, userId: userId}))
            } else {
                dispatch(addToCartTC({
                    title: title,
                    image: image,
                    price: price,
                    count: 1,
                    itemId: id,
                    userId,
                    availability: +availability
                }))
            }
        }
    }

    return <div className={s.container}>
        <img src={image} className={s.image}></img>
        <div>{title}</div>
        <div>{price} $</div>
        <div>Наличие {availability}</div>
        <button onClick={() => {
            addToCartHandler()
        }}>Добавить в корзину
        </button>
    </div>
}