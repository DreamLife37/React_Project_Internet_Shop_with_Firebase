import React from 'react';
import './App.css';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {Route, Routes} from 'react-router-dom';
import {HomePage} from "./pages/HomePage";
import {Cart} from "./pages/Cart/Cart";
import {Preloader} from "./components/preloader/Preloader";
import {useAppSelector} from "./hooks/redux-hooks";

function App() {
    const isLoading = useAppSelector(state => state.app.isLoading)
    console.log(isLoading)
    return (
        <div className="App">
            <header className="App-header">

                {isLoading && <Preloader/>}
                <Routes>
                    <Route path={'/login'} element={<LoginPage/>}/>
                    <Route path={'/register'} element={<RegisterPage/>}/>
                    <Route path={'/'} element={<HomePage/>}/>
                    <Route path={'/cart'} element={<Cart/>}/>
                </Routes>

            </header>
        </div>
    );
}

export default App;
