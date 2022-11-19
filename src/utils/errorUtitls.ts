import {Dispatch} from "@reduxjs/toolkit"
import {setAppError, setAppStatus} from "../store/slices/appSlice";

export const handleServerNetworkError = (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: "failed"}))
    if (navigator.onLine) {
        dispatch(setAppError({
            error: {
                messageError: "Ошибка, попробуйте перезагрузить страницу",
                typeError: 'error'
            }
        }))
    } else {
        dispatch(setAppError({
            error: {
                messageError: "Проверьте доступ к интернет",
                typeError: 'error'
            }
        }))

    }
}
