import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { User } from "../types/User.ts";

interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    updateLoginState: (user: User) => Promise<void>
    checkLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
}

//createContext() returns provider and consumer
const AuthContext = createContext<AuthContextProps |  undefined>(undefined);

//Provider: wraps part of component tree where values should be available
interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [loggedIn, setLoggedIn] = useState({
        isAuthenticated: false,
        user: null as User | null,
    });

    const updateLoginState = async (user: any) => {
        await checkLogin();
        setLoggedIn({ isAuthenticated: true, user: user});
    };

    const checkLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/c', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (data.isAuthenticated) {
                setLoggedIn({isAuthenticated: true, user: data.user});
            }
        } catch (error) {
            console.error('Error fetching auth status: ', error);
        }
    };

    const handleLogout =  async () => {
        try {
            const response = await fetch('http://localhost:3000/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                setLoggedIn({isAuthenticated: false, user: null });
            }
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    };
    useEffect(() => {
        checkLogin();
    }, []);

    useEffect(() => {
        console.log('Authentication state changed: ', loggedIn);
    }, [loggedIn]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: loggedIn.isAuthenticated,
                user: loggedIn.user,
                updateLoginState,
                checkLogin,
                handleLogout,

            }}>
            {children}
        </AuthContext.Provider>
    );
};

//consumer
export const  useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
