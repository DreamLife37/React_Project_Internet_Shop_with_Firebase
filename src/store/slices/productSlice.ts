import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, deleteField, doc, onSnapshot, query, setDoc, Timestamp, updateDoc} from "firebase/firestore";
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
    async (param: { userId: string | null }, {dispatch, getState}) => {
        if (param.userId != null) {
            try {
                dispatch(setAppStatus({isLoading: true}))
                const cartRef = doc(db, '/cart', param.userId)
                const unsubscribe = onSnapshot(cartRef, (itemCart) => {
                    if (itemCart.exists()) {
                        console.log(itemCart.data().cart)
                        debugger
                        dispatch(setDataCart(itemCart.data().cart))
                        dispatch(setAppStatus({isLoading: false}))

                        // @ts-ignore
                        const itemsArr = getState().products.cart.items
                        console.log(itemsArr)
                        const amount = (itemsArr.reduce((a: any, v: { price: number; count: number }) => a = a + v.price * v.count, 0));
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
                    // [`cart.${[param.itemId]}`]: deleteField()
                    [`cart`]: deleteField()
                });
            } catch (e) {
                console.log("No items for remove")
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
        //dispatch(setAppStatusAC({isLoading: true}))
        // @ts-ignore
        const userId = getState().auth.id
        // @ts-ignore
        const orders = getState().products.orders
        console.log(orders)
        if (userId != null) {
            const orderRef = doc(db, 'cart', userId)
            const orderModel = {
                name: param.name,
                email: param.email,
                phone: param.phone,
                amountCart: param.amountCart,
                date: Timestamp.fromDate(new Date()),
                items: param.cartOrder
            }
            console.log('orders', orders)
            debugger
            try {
                await setDoc(orderRef,
                    {
                        orders: orders ? [...orders, orderModel] : [orderModel]
                    },
                    {merge: true})

            } catch (e) {
                console.log("Error ")
            }
        }
    })


export const fetchDataOrdersTC = createAsyncThunk(
    'product/fetchDataOrders',
    async (_, {dispatch, getState}) => {
        // @ts-ignore
        const userId = getState().auth.id
        if (userId != null) {
            try {
                dispatch(setAppStatus({isLoading: true}))
                const cartRef = doc(db, '/cart', userId)
                const unsubscribe = onSnapshot(cartRef, (itemOrder) => {
                    if (itemOrder.exists()) {
                        console.log(itemOrder.data().orders)
                        dispatch(setDataOrders(itemOrder.data().orders))
                        dispatch(setAppStatus({isLoading: false}))

                    } else {
                        console.log("No items in Cart")
                    }
                });
            } catch (e) {
                console.log("No items in Cart")
            }
        }
    })


type OrderModelType = {
    name: string,
    email: string,
    phone: string,
    dateExample: string,
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
    orders: OrderModelType[]
}


const initialState: InitialStateType = {
    products: [],
    cart: {
        items: [],
        amount: 0
    },
    orders: []
}


const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setDataProducts(state, action) {
            state.products = action.payload
        },
        setDataCart(state, action) {
            debugger
            if (action.payload===undefined) {
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
            console.log(action.payload)
            //debugger
            const values = Object.values(action.payload);
            console.log('values', values);
            // @ts-ignore
            console.log(state.orders)
            // @ts-ignore
            state.orders = action.payload
            console.log(state)
        },
    },
    extraReducers: (builder) => {
        // builder.addCase(addToCartTC.fulfilled, (state, action) => {
        //
        //     // @ts-ignore
        //     state.cart.items = action.payload ? action.payload : []
        // })
    }
})
export const {setDataProducts, setDataCart, setAmountCart, setDataOrders} = productSlice.actions
export const productReducer = productSlice.reducer
