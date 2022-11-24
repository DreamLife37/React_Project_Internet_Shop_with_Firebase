import {Login} from "../../components/Login"
import s from './LoginPage.module.css'

export const LoginPage = () => {
    return <div>
        <div className={s.title}>Вход</div>
        <Login/>
    </div>
}