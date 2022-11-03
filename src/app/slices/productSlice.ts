import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {collection, onSnapshot, query} from "firebase/firestore";
import {db} from "../../firebase";
import {ProductInCatalogType} from "../../components/ProductInCatalog/ProductInCatalog";

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

const initialState = {
    products: [] as ProductInCatalogType[]
}

const
    productSlice = createSlice({
        name: 'product',
        initialState,
        reducers: {
            setDataProducts(state, action) {
                debugger
                state.products = action.payload
            },
        },
        // extraReducers: (builder) => {
        //     builder.addCase(fetchAllProductsTC.fulfilled, (state, action) => {
        //         state.products = action.payload ? action.payload : []
        //     })
        // }
    })
export const {setDataProducts} = productSlice.actions
export const productReducer = productSlice.reducer
