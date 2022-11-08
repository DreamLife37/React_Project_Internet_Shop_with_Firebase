import s from './ProductInCatalog.module.css'
import {FC} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {addToCartTC, updateItemCartTC} from "../../store/slices/productSlice";


export type ProductInCatalogType = {
    availability: string
    price: number
    image: string
    title: string
    id: string
    //addToCart: (payload: AddToCartType) => void
    //updateItem: (idItem: string, count: number) => void
}

export const ProductInCatalog: FC<ProductInCatalogType> = ({
                                                               availability,
                                                               price,
                                                               image,
                                                               title,
                                                               id,
                                                               //addToCart,
                                                               //updateItem
                                                           }) => {
    const itemsCart = useAppSelector(state => state.products.cart.items)
    const userId = useAppSelector(state => state.auth.id)
    const dispatch = useAppDispatch()

    const addToCartHandler = () => {
        let currentItemCart = itemsCart.find((i) => i.idItem === id)
        if (!!currentItemCart) {
            dispatch(updateItemCartTC({itemId: id, count: currentItemCart.count + 1, userId: userId}))
        } else {
            dispatch(addToCartTC({title: title, image: image, price: price, count: 1, itemId: id, userId, availability: +availability}))
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