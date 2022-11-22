import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, deleteField, doc, onSnapshot, query, serverTimestamp, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {ProductInCatalogType} from "../../components/ProductInCatalog/ProductInCatalog";
import {initializeApp, setAppError, setAppStatus} from "./appSlice";
import {ItemCartType} from "../../pages/Cart/ItemCart/ItemCart";
import {handleServerNetworkError} from "../../utils/errorUtitls";
import {AppRootStateType} from "../store";


export const fetchAllProductsTC = createAsyncThunk<any>(
    'product/getAllProduct',
    async (_, {dispatch}) => {
        dispatch(setAppStatus({status: "loading"}))
        try {
            const q = query(collection(db, '/products'))
            onSnapshot(q, (querySnapshot) => {
                dispatch(setDataProducts(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))));
                if (querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})).length > 0) {
                    dispatch(initializeApp())
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    handleServerNetworkError(dispatch)
                    throw new Error("New error")
                }
            });
        } catch (e) {
            dispatch(setAppStatus({status: "failed"}))
            console.log('Error in fetchAllProducts', e)
        }
    })

export const addToCartTC = createAsyncThunk(
    'product/addToCart',
    async (param: { title: string, image: string, price: number, count: number, itemId: string, userId: string | null, availability: number }, {dispatch}) => {
        dispatch(setAppStatus({status: "loading"}))
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
                dispatch(setAppStatus({status: "succeeded"}))
            } catch (e) {
                dispatch(setAppStatus({status: "failed"}))
                console.log("Error")
            }
        }
    })

export const fetchDataCartTC = createAsyncThunk(
    'product/fetchDataCart',
    async (param: { userId: string | null }, {dispatch, getState, rejectWithValue}) => {
        if (param.userId != null) {
            dispatch(setAppStatus({status: "loading"}))
            try {
                const cartRef = doc(db, '/cart', param.userId)
                onSnapshot(cartRef, (itemCart) => {
                    if (itemCart.exists()) {
                        dispatch(setDataCart(itemCart.data().cart))
                        const state = getState() as AppRootStateType
                        const itemsArr = state.products.cart.items
                        const amount = (itemsArr.reduce((a: any, v: { price: number; count: number }) => a = a + v.price * v.count, 0));
                        dispatch(setAmountCart(amount))
                        dispatch(setAppStatus({status: "succeeded"}))
                    } else {
                        throw new Error("New error")
                    }
                });
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })

export const updateItemCartTC = createAsyncThunk(
    'product/updateItemCart',
    async (param: { itemId: string, count: number, userId: string | null }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: "loading"}))
        if (param.userId != null) {
            try {
                if (navigator.onLine) {
                    await updateDoc(doc(db, 'cart', param.userId), {
                            [`cart.${[param.itemId]}.count`]: param.count
                        }
                    )
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    throw new Error("No Internet")
                }
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })

export const removeItemCartTC = createAsyncThunk(
    'product/removeItemCart',
    async (param: { itemId: string, userId: string | null }, {dispatch}) => {
        dispatch(setAppStatus({status: "loading"}))

        if (param.userId != null) {
            try {
                if (navigator.onLine) {
                    await updateDoc(doc(db, 'cart', param.userId), {
                        [`cart.${[param.itemId]}`]: deleteField()
                    });
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    throw new Error("No Internet")
                }
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })

export const removeAllItemCartTC = createAsyncThunk(
    'product/removeAllItemCart',
    async (param: { userId: string | null }, {dispatch}) => {
        dispatch(setAppStatus({status: "loading"}))
        if (param.userId != null) {
            try {
                if (navigator.onLine) {
                    await updateDoc(doc(db, 'cart', param.userId), {
                        [`cart`]: deleteField()
                    });
                    dispatch(setAppStatus({status: "succeeded"}))
                } else {
                    throw new Error("No Internet")
                }
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })


export const sendOrderTC = createAsyncThunk(
    'product/sendOrder',
    async (param: {
        name: string, email: string, phone: string, amountCart: number, cartOrder: Array<{
            name: string,
            price: number,
            count: number,
        }>
    }, {dispatch, getState}) => {
debugger
        dispatch(setAppStatus({status: "loading"}))
        const state = getState() as AppRootStateType
        const userId = state.auth.id
        const orders = state.products.orders
        if (userId != null) {
            const orderRef = doc(db, 'cart', userId)
            const orderModel = {
                name: param.name,
                email: param.email,
                phone: param.phone,
                amountCart: param.amountCart,
                 date: Timestamp.fromDate(new Date()).seconds,
                //date: Timestamp.fromDate(new Date()).toDate(),

                items: param.cartOrder
            }
            console.log('Timestamp.fromDate(new Date())',Timestamp.fromDate(new Date()).toDate())
            console.log('orders', orders)
            try {
                debugger
                await setDoc(orderRef,
                    {
                        orders: orders ? [...orders, orderModel] : [orderModel]
                    },
                    {merge: true})
                dispatch(setAppStatus({status: "succeeded"}))
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })


export const fetchDataOrdersTC = createAsyncThunk(
    'product/fetchDataOrders',
    async (_, {dispatch, getState}) => {
        const state = getState() as AppRootStateType
        const userId = state.auth.id
        if (userId != null) {
            try {
                if (navigator.onLine) {
                    const cartRef = doc(db, '/cart', userId)
                    onSnapshot(cartRef, (itemOrder) => {
                        if (itemOrder.exists()) {
                            dispatch(setDataOrders(itemOrder.data().orders))
                        }
                    })
                } else {
                    throw new Error("No Internet")
                }
            } catch (e) {
                handleServerNetworkError(dispatch)
            }
        }
    })


export type OrderModelType = {
    name: string,
    email: string,
    phone: string,
    date: string,
    amountCart: number,
    items: Array<{
        name: string,
        price: number,
        count: number,
        amountCart: number
    }>
}

type InitialStateType = {
    products: ProductInCatalogType[],
    cart: {
        items: ItemCartType[],
        amount: number
    },
    orders: OrderModelType[],
    selectedOrderId: string
}


const initialState: InitialStateType = {
    products: [],
    cart: {
        items: [],
        amount: 0
    },
    orders: [],
    selectedOrderId: ''
}


const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setDataProducts(state, action) {
            state.products = action.payload
        },
        setDataCart(state, action) {
            if (action.payload === undefined) {
                state.cart.items = []
            } else {
                const values = Object.values(action.payload);
                // @ts-ignore
                state.cart.items = values
            }
        },
        setAmountCart(state, action) {
            state.cart.amount = action.payload
        },
        setDataOrders(state, action) {
            if (action.payload !== undefined) {
                const values = Object.values(action.payload);
                state.orders = action.payload
            }
        },
        setSelectedOrder(state, action) {
            state.selectedOrderId = action.payload
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(addToCartTC.fulfilled, (state, action) => {
        //
        //     // @ts-ignore
        //     state.cart.items = action.payload ? action.payload : []
        // })
    }
})
export const {setDataProducts, setDataCart, setAmountCart, setDataOrders, setSelectedOrder} = productSlice.actions
export const productReducer = productSlice.reducer
