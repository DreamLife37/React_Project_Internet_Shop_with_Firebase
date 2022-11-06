import s from './ItemCart.module.css'
import {useAppDispatch} from "../../../hooks/redux-hooks";
import {useAuth} from '../../../hooks/use-auth';
import {FC} from "react";
import {removeItemCartTC, updateItemCartTC} from "../../../store/slices/productSlice";

export type ItemCartType = {
    image: string,
    idItem: string,
    title: string,
    price: number,
    count: number,
    amount: number
}

export const ItemCart: FC<ItemCartType> = ({idItem, image, title, count, price, amount}) => {
    const {id} = useAuth()
    const dispatch = useAppDispatch()

    const downCount = () => {
        if (count === 1) {
            dispatch(removeItemCartTC({itemId: idItem, userId: id}))
        } else {
            dispatch(updateItemCartTC({itemId: idItem, count: count - 1, userId: id}))
        }
    }

    const upCount = () => {
        dispatch(updateItemCartTC({itemId: idItem, count: count + 1, userId: id}))
    }

    return <div className={s.item}>
        <img className={s.image}
             src={image}></img>
        <div>{title}</div>
        <div>{price}</div>
        <div>
            <button onClick={downCount}>-</button>
            <span>{count}</span>
            <button onClick={upCount}>+</button>
        </div>
        <div>{amount}</div>

    </div>

}