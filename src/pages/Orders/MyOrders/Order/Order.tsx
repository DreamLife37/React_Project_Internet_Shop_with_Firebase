import React, {FC, useEffect} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import s from './Order.module.css'
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux-hooks";
import {useAuth} from "../../../../hooks/use-auth";
import {fetchDataOrdersTC} from "../../../../store/slices/productSlice";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Order: FC = () => {
    const dispatch = useAppDispatch()
    const {isAuth, id} = useAuth()
    const orders = useAppSelector(state => state.products.orders)
    const selectedOrderId = useAppSelector(state => state.products.selectedOrderId)
    const navigation = useNavigate()

    const handleBackButton = () => {
        navigation('/myOrders')
        console.log()
    }

    useEffect(() => {
        dispatch(fetchDataOrdersTC())
    }, [])

    if (!isAuth) {
        return <Navigate to={"/login"}/>
    }

    let selectedOrder = orders.find((order) => {
        return order.orderId === selectedOrderId
    })

    let dateTransform

    if (selectedOrder) {
        dateTransform = new Date(+selectedOrder.date * 1000).toLocaleString()
    }


    return <div className={s.container}>
        {selectedOrder && <div>
            <div onClick={handleBackButton} className={s.titleButtonBack}>
                <IconButton aria-label="arrow-back"
                            onClick={handleBackButton}>
                    <ArrowBackIcon style={{color: "#4E97FD"}}/>
                </IconButton>
                к моим заказам
            </div>

            <h3 className={s.title}>{`Заказ #${selectedOrder.orderId}`}</h3>
            <div className={s.date}>
                Дата создания:
                <div>{dateTransform}</div>
            </div>
            <div className={s.items}>{selectedOrder.items.map((i, key) =>
                <div key={key} className={s.item}>
                    <img src={i.image} className={s.image}/>
                    <div className={s.secondColumn}>
                        <span className={s.text}>{i.name}</span>
                        <div className={s.textPrice}>{i.price} $ x {i.count} </div>
                    </div>
                </div>)
            }</div>
            <div className={s.amountCart}>Сумма заказа: <span>{selectedOrder.amountCart} $</span></div>
        </div>
        }
    </div>
}
