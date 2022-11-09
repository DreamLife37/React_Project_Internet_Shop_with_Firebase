import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, deleteField, doc, onSnapshot, query, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {ProductInCatalogType} from "../../components/ProductInCatalog/ProductInCatalog";

import {setAppStatus} from "./appSlice";
import {ItemCartType} from "../../pages/Cart/ItemCart/ItemCart";

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

export const fetchDataCartTC = createAsyncThunk(
    'product/fetchDataCart',
    async (param: { userId: string | null }, {dispatch,getState}) => {
        if (param.userId != null) {
            try {
                dispatch(setAppStatus({isLoading: true}))
                const cartRef = doc(db, '/cart', param.userId)
                const unsubscribe = onSnapshot(cartRef, (itemCart) => {
                    if (itemCart.exists()) {
                        dispatch(setDataCart(itemCart.data().cart))
                        dispatch(setAppStatus({isLoading: false}))

                        // @ts-ignore
                        const itemsArr = getState().products.cart.items
                        console.log(itemsArr)
                        const amount = ( itemsArr.reduce((a: any, v: { price: number; count:number}) =>  a = a + v.price * v.count, 0 ));
                        dispatch(setAmountCart(amount))

                    } else {
                        console.log("No items in Cart")
                    }
                });
            } catch (e) {
                console.log("No items in Cart")
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

type InitialStateType = {
    products: ProductInCatalogType[],
    cart: {
        items: ItemCartType[],
        amount: Number
    }
}


const initialState: InitialStateType = {
    products: [],
    cart: {
        items: [],
        amount: 0
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
        },
        setAmountCart(state, action) {

            state.cart.amount = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addToCartTC.fulfilled, (state, action) => {

            // @ts-ignore
            state.cart.items = action.payload ? action.payload : []
        })
    }
})
export const {setDataProducts, setDataCart, setAmountCart} = productSlice.actions
export const productReducer = productSlice.reducer
