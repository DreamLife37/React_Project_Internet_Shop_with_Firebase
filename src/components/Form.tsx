import {useState} from "react"

// @ts-ignore
export const Form = ({title, handleClick}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return <div>
        <input type={'email'}
               value={email}
               placeholder={'E-mail'}
               onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input type={'password'}
               value={password}
               placeholder={'Password'}
               onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <button onClick={() => handleClick(email, password)}>{title}</button>
    </div>
}