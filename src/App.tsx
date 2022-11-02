import React from 'react';
import logo from './logo.svg';
import './App.css';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {Route, Routes} from 'react-router-dom';
import {HomePage} from "./pages/HomePage";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <Routes>
                    <Route path={'/login'} element={<LoginPage/>}/>
                    <Route path={'/register'} element={<RegisterPage/>}/>
                    <Route path={'/'} element={<HomePage/>}/>
                </Routes>

            </header>
        </div>
    );
}

export default App;
