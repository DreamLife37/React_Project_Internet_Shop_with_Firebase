import {Link, useNavigate} from "react-router-dom";
import React from "react";
import s from './SuccessfulOrder.module.css'
import {ReactComponent as SuccessfulOrderSvg} from './../../../assets/images/successfulOrder.svg';
import {ButtonCustomBlue} from "../../../components/ButtonCustomBlue/ButtonCustomBlue";

export const SuccessfulOrder = () => {
    const navigate = useNavigate()

    return <div>
        <div className={s.svg}>
            <SuccessfulOrderSvg/>
        </div>
        <h2 className={s.h2}>Заказ успешно оформлен</h2>
        <h3 className={s.h3}>В ближайшее время наши менеджеры свяжутся с вами для подтверждения заказа</h3>
        <ButtonCustomBlue handleButton={() => navigate('/')} title={'Каталог товаров'} styleFontSize={'14px'}/>
        <div><ButtonCustomBlue handleButton={() => navigate('/myorders')} title={'Мои заказы'} styleFontSize={'14px'}/></div>
    </div>
}