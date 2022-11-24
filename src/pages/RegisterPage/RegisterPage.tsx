import {SignUp} from "../../components/SignUp"
import s from './RegisterPage.module.css'

export const RegisterPage = () => {
    return <div>
        <div className={s.title}>Регистрация</div>
        <SignUp/>
    </div>
}