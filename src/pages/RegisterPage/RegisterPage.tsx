import {SignUp} from "../../components/SignUp"
import s from './RegisterPage.module.css'

export const RegisterPage = () => {
    return <div className={s.container}>
        <div className={s.title}>Регистрация</div>
        <SignUp/>
    </div>
}