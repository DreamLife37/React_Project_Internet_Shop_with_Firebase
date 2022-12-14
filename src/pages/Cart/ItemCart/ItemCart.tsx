import s from './ItemCart.module.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/redux-hooks";
import {useAuth} from '../../../hooks/use-auth';
import {FC} from "react";
import {removeItemCartTC, updateItemCartTC} from "../../../store/slices/productSlice";
import {setAppError} from "../../../store/slices/appSlice";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

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
            dispatch(setAppError({error: {messageError: `На складе доступно ${availability}`, typeError: 'warning'}}))
        } else {
            dispatch(updateItemCartTC({itemId: idItem, count: count + 1, userId: id}))
        }
    }

    return <div className={s.item}>
        <img className={s.image} src={image}/>
        <div className={s.secondColumn}>
            <div className={s.textTitle}>{title}</div>
            <div className={s.textPrice}>{price} $ x {count} <span className={s.textAmount}>{amount} $</span></div>
            <div>
                <IconButton aria-label="minus" onClick={downCount}>
                    <IndeterminateCheckBoxIcon style={{color: "#4E97FD", padding: '0'}}/>
                </IconButton>
                <span className={s.textCount}>{count}</span>
                <IconButton aria-label="plus" onClick={upCount} className={s.text}>
                    <AddBoxIcon style={{color: "#4E97FD",padding: '0'}}/>
                </IconButton>
            </div>
        </div>
    </div>

}