import { useState } from 'react'
import axios from 'axios'
import './LoginPage.css'
import { useNavigate } from 'react-router'
import { useAuth } from '../../AuthContext';
import { Header } from '../../components/Header';
export function LoginPage() {

    const navigate = useNavigate();
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    const { setUser } = useAuth();

    function saveUsernameInput(event)
    {
        setUsernameInput(event.target.value)
    }

    function savePasswordInput(event) {
        setPasswordInput(event.target.value)
    }

    const handleLoginAttempt = async () => {
        
        try {
            const response = await axios.post('/api/auth', {
                username: usernameInput,
                password: passwordInput
            })
            
            if (response.status === 200) {
                const res = await axios.get("/api/auth/status")

                setUser(res.data)
                navigate("/")
            }
        } catch (error) {

            if(error.status === 401)
            {
                setLoginStatus("invalid credentials")
                return
            }


            setLoginStatus(error.message)
        }
    }

    return (
        <div className="login-page-container">
            <Header/>
            <div className='login-container'>
                <div className="login-username-container">
                    <input 
                        className="login-input" 
                        placeholder='username'
                        onChange={saveUsernameInput}
                        value={usernameInput}
                    >
                    </input>
                </div>
                <div className="login-password-container">
                    <input 
                        className="login-input" 
                        type="password" 
                        placeholder='password'
                        onChange={savePasswordInput}
                        value={passwordInput}
                    >
                    </input>
                </div>
                <button className="login-button" onClick={handleLoginAttempt}>Login</button>
                <div className='login-status'>{loginStatus}</div>
                </div>
            
            
            </div>
    )
}