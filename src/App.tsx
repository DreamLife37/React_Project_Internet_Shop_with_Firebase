import React, {useEffect} from 'react';
import './App.css';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {Route, Routes} from 'react-router-dom';
import {HomePage} from "./pages/HomePage";
import {Cart} from "./pages/Cart/Cart";
import {Preloader} from "./components/preloader/Preloader";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {SnackBar} from "./components/snackbar/SnackBar";
import {SuccessfulOrder} from "./pages/Orders/SuccessfulOrder/SuccessfulOrder";
import {MyOrders} from "./pages/Orders/MyOrders/MyOrders";
import {MenuAppBar} from "./components/appBar/AppBar";
import {LinearProgress} from "@mui/material";
import {useAuth} from "./hooks/use-auth";
import {fetchAllProductsTC, fetchDataCartTC} from "./store/slices/productSlice";
import {initializeApp} from "./store/slices/appSlice";

function App() {
    const {isAuth, id} = useAuth()
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const error = useAppSelector(state => state.app.error)
    const appStatus = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (id != null || isAuth) {
            dispatch(fetchDataCartTC({userId: id}))
            dispatch(fetchAllProductsTC())
            // dispatch(initializeApp())
        }
    }, [])

    // if (isAuth) {
    //     console.log(!isInitialized)
    //     if (!isInitialized) {
    //         return <div>
    //             {/*style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>*/}
    //             <Preloader/>
    //         </div>
    //     }
    // }
    // {!isInitialized && isAuth && <Preloader/>}

    return (
        <div className="App">
            <MenuAppBar/>
            <div className={'LinearProgress'}>{appStatus === 'loading' && <LinearProgress/>}</div>
            {error.messageError && <SnackBar/>}
            <header className="App-header">
                {isAuth && !isInitialized ? <Preloader/> : ''}
                <Routes>
                    <Route path={'/login'} element={<LoginPage/>}/>
                    <Route path={'/register'} element={<RegisterPage/>}/>
                    <Route path={'/'} element={<HomePage/>}/>
                    <Route path={'/cart'} element={<Cart/>}/>
                    <Route path={'/successfulOrder'} element={<SuccessfulOrder/>}/>
                    <Route path={'/myOrders'} element={<MyOrders/>}/>
                </Routes>

            </header>
        </div>
    );
}

export default App;
