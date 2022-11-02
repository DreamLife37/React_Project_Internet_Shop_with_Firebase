import {SignUp} from "../components/SignUp"
import {Link} from "react-router-dom";


export const RegisterPage = () => {
    return <div>
        <h1>Register Page</h1>
        <SignUp/>
        Have you account? <Link to={'/login'}>Sign in</Link>
    </div>
}