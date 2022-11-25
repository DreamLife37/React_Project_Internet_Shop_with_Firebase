import {FC} from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import * as React from "react";
import s from './CountItemsCart.module.css'

type CountItemsCart = {
    count: number
}

export const CountItemsCart: FC<CountItemsCart> = ({count}) => {
    return <div className={s.container}>
        <div className={s.logoCart}>
            <ShoppingCartIcon style={{color: "black", paddingRight: '10px'}}/>
        </div>
            <div className={s.textCount}>{count}</div>
    </div>
}