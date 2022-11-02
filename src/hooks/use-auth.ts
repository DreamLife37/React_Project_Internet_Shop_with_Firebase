import {useAppSelector} from "../app/store";
import {useSelector} from "react-redux";

export function useAuth() {
    // @ts-ignore
    const {email, token, id} = useAppSelector(state => state.auth)

    return {
        isAuth: !!email,
        email,
        token,
        id
    }
}