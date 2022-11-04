import s from './ProductInCatalog.module.css'
import {FC} from "react";
import {AddToCartType} from "../../pages/HomePage";


export type ProductInCatalogType = {
    availability: string
    price: number
    image: string
    title: string
    id: string
    addToCart: (payload: AddToCartType) => void
}

export const ProductInCatalog: FC<ProductInCatalogType> = ({
                                                               availability,
                                                               price,
                                                               image,
                                                               title,
                                                               id,
                                                               addToCart
                                                           }) => {
    const addToCartHandler = () => {
        addToCart({title: title, image: image, price: price, count: 1, idItem: id})
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