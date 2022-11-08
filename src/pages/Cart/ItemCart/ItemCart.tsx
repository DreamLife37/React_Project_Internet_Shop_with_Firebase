import s from './ItemCart.module.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from '../../../hooks/use-auth';
import {FC} from "react";
import {removeItemCartTC, updateItemCartTC} from "../../../store/slices/productSlice";
import {setAppError} from "../../../store/slices/appSlice";

export type ItemCartType = {
    image: string,
    idItem: string,
    title: string,
    price: number,
    count: number,
    amount: number,
    availability: number
}

export const ItemCart: FC<ItemCartType> = ({idItem, image, title, count, price, amount, availability}) => {
    const {id} = useAuth()
    const dispatch = useAppDispatch()
    const error = useAppSelector(state => state.app.error)

    const downCount = () => {
        if (count === 1) {
            dispatch(removeItemCartTC({itemId: idItem, userId: id}))
        } else {
            dispatch(updateItemCartTC({itemId: idItem, count: count - 1, userId: id}))
        }
    }

    const upCount = () => {
        if (count >= availability) {
            console.log(error)
            dispatch(setAppError({error: `На складе доступно ${availability}`}))
        } else {
            dispatch(updateItemCartTC({itemId: idItem, count: count + 1, userId: id}))
        }

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