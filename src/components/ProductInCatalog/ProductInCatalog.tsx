import s from './ProductInCatalog.module.css'
import {FC} from "react";


export type ProductInCatalogType = {
        availability: string
        price: string
        image: string
        title: string
        id: string
}

export const ProductInCatalog: FC<ProductInCatalogType[]> = () => {

    return <div className={s.container}>

    </div>
}