import {Login} from "../components/Login"
import {Link} from "react-router-dom";

export const LoginPage = () => {
    return <div>
        <h1>Login Page</h1>
        <Login/>
        Have you not account? <Link to={'/register'}>Sign up</Link>
    </div>
}