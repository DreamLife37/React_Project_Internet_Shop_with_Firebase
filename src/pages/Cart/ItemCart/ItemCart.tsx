import s from './ItemCart.module.css'
import {useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from '../../../hooks/use-auth';
import {FC} from "react";


export type ItemCartType = {
    image: string,
    idItem: string,
    title: string,
    price: number,
    count: number
}

export const ItemCart: FC<ItemCartType> = ({idItem, image, title, count, price}) => {
    //const [cart, setCart] = useState([])
    const {id} = useAuth()

    const cart = useAppSelector(state => state.products.cart)
    console.log(cart)


    return <div className={s.item}>
        <img className={s.image}
             src={image}></img>
        <div>{title}</div>
        <div>
            <button>-</button>
            <span>{count}</span>
            <button>+</button>
        </div>
        <div>{price}</div>
    </div>

}