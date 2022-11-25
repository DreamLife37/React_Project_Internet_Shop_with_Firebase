import {Login} from "../../components/Login"
import s from './LoginPage.module.css'

export const LoginPage = () => {
    return <div className={s.container}>
        <div className={s.title}>Вход</div>
        <Login/>
    </div>
}