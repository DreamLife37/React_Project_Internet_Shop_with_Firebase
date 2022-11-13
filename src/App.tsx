import React from 'react';
import './App.css';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {Route, Routes} from 'react-router-dom';
import {HomePage} from "./pages/HomePage";
import {Cart} from "./pages/Cart/Cart";
import {Preloader} from "./components/preloader/Preloader";
import {useAppSelector} from "./hooks/redux-hooks";
import {SnackBar} from "./components/snackbar/SnackBar";
import {SuccessfulOrder} from "./pages/Orders/SuccessfulOrder/SuccessfulOrder";
import {MyOrders} from "./pages/Orders/MyOrders/MyOrders";
import {MenuAppBar} from "./components/appBar/AppBar";

function App() {
    const isLoading = useAppSelector(state => state.app.isLoading)
    const error = useAppSelector(state => state.app.error)

    return (
        <div className="App">
            <MenuAppBar/>
            <header className="App-header">
                {isLoading && <Preloader/>}
                {error.messageError && <SnackBar/>}
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
