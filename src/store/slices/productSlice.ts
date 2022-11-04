import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {ProductInCatalogType} from "../../components/ProductInCatalog/ProductInCatalog";
import {ItemCartType} from "../../pages/Cart/Cart";
import {useAuth} from "../../hooks/use-auth";
import {useAppSelector} from "../../hooks/redux-hooks";
import {useState} from "react";

export const fetchAllProductsTC = createAsyncThunk<any>(
    'product/getAllProduct',
    async (_, {dispatch}) => {
        //dispatch(setAppStatusAC({isLoading: true}))
        try {
            const q = query(collection(db, '/products'))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                dispatch(setDataProducts(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))));
                console.log(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
            });

            //dispatch(setAppStatusAC({isLoading: false}))
            return unsubscribe

        } catch (e) {
            console.log('getAllProduct', e)
        }
    })

export const addToCartTC = createAsyncThunk(
    'product/addToCart ',
    async (param: { idItem: string }, {dispatch}) => {
        debugger
        //const {id} = useAuth()
        //console.log(id)
        const [cart, setCart] = useState([])
        const id = useAppSelector(state => state.auth.id)
        console.log(id)
        //dispatch(setAppStatusAC({isLoading: true}))
        if (id != null) {
            const cartRef = doc(db, 'cart', id)
            debugger
            try {
                await setDoc(cartRef,
                    {cart: cart ? [...cart, {idItem: '12124232121', count: 13}] : []},
                    {merge: true})
            } catch (e) {
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
            state.cart.items = action.payload
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
