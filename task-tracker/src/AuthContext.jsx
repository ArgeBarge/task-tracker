import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function checkAuth() {
            
            try {
                const response = await axios.get('/api/auth/status');
                setUser(response.data)
            } catch(err) {
                console.log(err)
                setUser(null);
            } finally {
                setLoading(false);
            }
            
        }

        checkAuth();
        
    }, [])
            
    return (
        <AuthContext.Provider value={{ user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}