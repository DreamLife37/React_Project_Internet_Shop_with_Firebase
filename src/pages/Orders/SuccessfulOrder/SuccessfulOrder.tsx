import {Link} from "react-router-dom";
import React from "react";
import s from './SuccessfulOrder.module.css'
import {ReactComponent as SuccessfulOrderSvg} from './../../../assets/images/successfulOrder.svg';

export const SuccessfulOrder = () => {
    return <div>
        <div className={s.svg}>
            <SuccessfulOrderSvg/>
        </div>
        <h2 className={s.h2}>Заказ успешно оформлен</h2>
        <h3 className={s.h3}>В ближайшее время наши менеджеры свяжутся с вами для подтверждения заказа</h3>

        <Link to={'/myorders'}>
            <div>{`Мои заказы`}</div>
        </Link>
    </div>
}