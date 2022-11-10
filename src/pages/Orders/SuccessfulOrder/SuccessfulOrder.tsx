import {Link} from "react-router-dom";
import React from "react";

export const SuccessfulOrder = () => {
    return <div>
        <h2>Заказ успешно оформлен</h2>
        <h3>В ближайшее время наши менеджеры свяжутся с вами для подтверждения заказа</h3>

        <Link to={'/myorders'}>
            <div>{`Мои заказы`}</div>
        </Link>
    </div>
}