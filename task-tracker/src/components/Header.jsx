import { useAuth } from '../AuthContext'
import userImage from '../assets/images/User_Circle.png'
import burger from '../assets/images/Hamburger_MD.png'
import axios from 'axios'
import './Header.css'

export function Header() {
   
    const { user, setUser } = useAuth()

    const handleOnLogout = async () => {
        await axios.post("/api/auth/logout");

        setUser(null)
    }
    return (
        <div className="header">
            <div className='header-title'>
                <h3>Task Tracker</h3>
            </div>

            <div className='login-status-container'>
                <img className='login-status-image' src={userImage}></img>
                {user ? 
                    <>
                        {user.username}
                        <button 
                            className="header-logout-button" 
                            onClick={handleOnLogout}
                        >
                        logout
                        </button>
                    </> 
                    :
                    <>Logged out</>
                    
                }
                
            </div>
            
        </div>
    )
}