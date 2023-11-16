import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { User } from "../types/User.ts";

//this file provides a centralized state management system for
// handling user authentication,
// including authentication state, user data, and relevant authentication functions
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

/**
 * AuthProvider is a React component that provides authentication state and functions
 * through the AuthContext to its descendants.
 *
 * @param children - The child components that will have access to the authentication context.
 * @constructor
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null as User | null,
    });

    // Function to update the authentication state after a successful login or registration
    const updateLoginState = async (user: User) => {
        const fetchedUser = await checkLogin();
        if (fetchedUser) {
            setAuthState({isAuthenticated: true, user: fetchedUser});
        }
    };

    // Function to check the authentication status on component mount
    const checkLogin = async (): Promise<User | null> => {
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
                return data.user;
            }
        } catch (error) {
            console.error('Error fetching auth status: ', error);
        }
        return null;
    };

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                setAuthState({isAuthenticated: false, user: null});
            }
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    };

    // Check authentication status on component mount
    useEffect(() => {
        checkLogin();
    }, []);

    // Log authentication state changes
    useEffect(() => {
        console.log('Authentication state changed: ', authState);
    }, [authState]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: authState.isAuthenticated,
                user: authState.user,
                updateLoginState,
                checkLogin,
                handleLogout,

            }}>
            {children}
        </AuthContext.Provider>
    );
};


//Define the useAuth hook for easy access to the authentication context
export const  useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;

}
