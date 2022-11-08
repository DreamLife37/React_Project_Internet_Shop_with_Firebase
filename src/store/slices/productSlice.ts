import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, deleteField, doc, onSnapshot, query, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {ProductInCatalogType} from "../../components/ProductInCatalog/ProductInCatalog";

import {setAppStatus} from "./appSlice";
import { ItemCartType } from "../../pages/Cart/ItemCart/ItemCart";

export const fetchAllProductsTC = createAsyncThunk<any>(
    'product/getAllProduct',
    async (_, {dispatch}) => {
        dispatch(setAppStatus({isLoading: true}))
        try {
            const q = query(collection(db, '/products'))
            await onSnapshot(q, (querySnapshot) => {
                dispatch(setDataProducts(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))));
                console.log(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
                dispatch(setAppStatus({isLoading: false}))
            });
        } catch (e) {
            console.log('getAllProduct', e)
        }
    })

export const addToCartTC = createAsyncThunk(
    'product/addToCart',
    async (param: { title: string, image: string, price: number, count: number, itemId: string, userId: string | null, availability: number }, {dispatch}) => {
        //dispatch(setAppStatusAC({isLoading: true}))
        if (param.userId != null) {
            const cartRef = doc(db, 'cart', param.userId)
            try {
                await setDoc(cartRef,
                    {
                        cart: {
                            [param.itemId]: {
                                title: param.title,
                                image: param.image,
                                price: param.price,
                                count: param.count,
                                idItem: param.itemId,
                                availability: param.availability
                            }
                        }
                    },
                    {merge: true})
            } catch (e) {
                console.log("Error ")
            }
        }
    })


export const updateItemCartTC = createAsyncThunk(
    'product/updateItemCart',
    async (param: { itemId: string, count: number, userId: string | null }, {dispatch}) => {
        if (param.userId != null) {
            try {
                await updateDoc(doc(db, 'cart', param.userId), {
                        [`cart.${[param.itemId]}.count`]: param.count
                    }
                )
            } catch (e) {
                console.log("No items in Cart")
            }
        }
    })

export const removeItemCartTC = createAsyncThunk(
    'product/removeItemCart',
    async (param: { itemId: string, userId: string | null }, {dispatch}) => {
        if (param.userId != null) {
            try {
                await updateDoc(doc(db, 'cart', param.userId), {
                    [`cart.${[param.itemId]}`]: deleteField()
                });
            } catch (e) {
                console.log("No items for remove")
            }
        }
    })


const initialState = {
    products: [] as ProductInCatalogType[],
    cart: {
        items: [] as ItemCartType[],
        amount: ''
    }
}


const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setDataProducts(state, action) {
            state.products = action.payload
        },
        setDataCart(state, action) {
            const values = Object.values(action.payload);
            console.log(values);
            // @ts-ignore
            state.cart.items = values
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addToCartTC.fulfilled, (state, action) => {

            // @ts-ignore
            state.cart.items = action.payload ? action.payload : []
        })
    }
})
export const {setDataProducts, setDataCart} = productSlice.actions
export const productReducer = productSlice.reducer
