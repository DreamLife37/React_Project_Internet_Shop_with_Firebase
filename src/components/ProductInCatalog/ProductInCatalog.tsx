import s from './ProductInCatalog.module.css'
import React, {FC} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {addToCartTC, updateItemCartTC} from "../../store/slices/productSlice";
import {setAppError} from "../../store/slices/appSlice";
import Button from "@mui/material/Button";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Fade} from 'react-awesome-reveal';
import Tilt from "react-parallax-tilt";
import {ButtonCustomBlue} from "../ButtonCustomBlue/ButtonCustomBlue";


declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }

    // allow configuration using `createTheme`
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

export type ProductInCatalogType = {
    availability: number
    price: number
    image: string
    title: string
    id: string
}

export const ProductInCatalog: FC<ProductInCatalogType> = ({
                                                               availability,
                                                               price,
                                                               image,
                                                               title,
                                                               id,
                                                           }) => {
    const itemsCart = useAppSelector(state => state.products.cart.items)
    const userId = useAppSelector(state => state.auth.id)
    const dispatch = useAppDispatch()
    console.log(itemsCart)

    const addToCartHandler = () => {
        let currentItemCart = itemsCart.find((i) => i.idItem === id)
        if (currentItemCart && (currentItemCart.count >= availability)) {
            dispatch(setAppError({error: {messageError: `На складе доступно ${availability}`, typeError: 'warning'}}))
        } else {
            if (!!currentItemCart) {
                dispatch(updateItemCartTC({itemId: id, count: currentItemCart.count + 1, userId: userId}))
            } else {
                dispatch(addToCartTC({
                    title: title,
                    image: image,
                    price: price,
                    count: 1,
                    itemId: id,
                    userId,
                    availability: +availability
                }))
            }
        }
    }

    return <div className={s.container}>
        <Fade delay={100} triggerOnce duration={500}>
            <div style={{color: "black"}}>11</div>
            <Tilt tiltEnable={false} scale={1.2} transitionSpeed={2500}>
                <img src={image} className={s.image}/> </Tilt>
            <div className={s.textTitle}>{title}</div>
            <div className={s.textPrice}>{price} $</div>
            <div className={s.textAvailability}>Наличие {availability}</div>
            <ButtonCustomBlue handleButton={addToCartHandler} title={'Добавить в корзину'}/>
        </Fade>
    </div>
}