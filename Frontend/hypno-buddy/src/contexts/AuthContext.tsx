import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { User } from "../types/User.ts";
import {FlashContext} from "./FlashContext.tsx";
//import {useNavigate} from "react-router-dom";

//this file provides a centralized state management system for
// handling user authentication,
// including authentication state, user data, and relevant authentication functions
interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    updateLoginState: (user: User) => Promise<void>
    checkLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
    handleLogin: (email: string, password: string)=> Promise<{ success: boolean; redirect: any; }>;
    patients: User[];
    fetchPatients: () => Promise<void>;
    selectedPatient: User | null;
    selectPatient: (user: User) => void;
    therapistOfPatient: {_id: string; name:{first: string, last:string}}|null;
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
    const {flash } = useContext(FlashContext);

    const [therapistState, setTherapistState] = useState({
        patients: [] as User[],
        selectedPatient: null as User | null
    });

    const [therapistOfPatient, setTherapistOfPatient] = useState<{_id: string; name:{first: string, last:string}}|null>(null);



    const fetchPatients = async () => {
        try {
            const response = await fetch(url +'/user/profile/patients', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.json();
                setTherapistState(prevState => ({
                    ...prevState,
                    patients: responseData.patients,
                }));

                const storedPatientJSON = sessionStorage.getItem('selectedPatient');
                if (storedPatientJSON) {
                    const storedPatient = JSON.parse(storedPatientJSON);
                    await selectPatient(storedPatient);
                } else {
                    sessionStorage.setItem('selectedPatient', JSON.stringify(responseData.patients[0]));
                    await selectPatient(responseData.patients[0]);
                }

            } else {
                console.error('Failed to get patients:', response.statusText);
            }
        } catch (error) {
            console.error('Error getting patients:', error);
        }
    };

    const selectPatient = async (selectedUser: User) => {
        if (selectedUser) {
            sessionStorage.setItem('selectedPatient', JSON.stringify(selectedUser));
            setTherapistState(prevState => ({
                ...prevState,
                selectedPatient: selectedUser,
            }));
        }
    };

    const fetchTherapist = async () => {
        try {
            const response = await fetch(url+ '/user/therapistOfPatient', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('res: ', responseData)
                setTherapistOfPatient(responseData);
            } else {
                console.error('Failed to get therapist:', response.statusText);
            }
        } catch (error) {
            console.error('Error getting therapist:', error);
        }
    };


    // Function to update the authentication state after a successful login or registration
    const updateLoginState = async (user: User) => {
        const fetchedUser = await checkLogin();
        if (fetchedUser) {
            setAuthState(prevState => ({
                ...prevState,
                isAuthenticated: true, user: fetchedUser
            }));
        }
    };

    // Function to check the authentication status on component mount
    const checkLogin = async () => {
        try {
            const response = await fetch(url + '/user/currentUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            setAuthState((prevState) => ({
                ...prevState,
                isAuthenticated: data.isAuthenticated,
                user: data.isAuthenticated ? data.user : null,
            }));
            if(data.user.role === 'therapist') {
                fetchPatients();
            }else{
                fetchTherapist();
            }
        } catch (error) {
            console.error('Error fetching auth status: ', error);

            setAuthState((prevState) => ({
                ...prevState,
                isAuthenticated: false,
                user: null,
            }));
        }
    };

    const handleLogin = async(email: string, password: string) : Promise<{ success: boolean, redirect: string, message: string}> => {
        try {
            const response = await fetch(url + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                await updateLoginState(data.user);
                flash(data.message);  // Display the success message from the server
                return { success: true, redirect: data.redirect, message: data.message };
            } else {
                flash(data.message || 'An error occurred while logging in');
                return { success: false, redirect: '/', message: data.message };
            }
        } catch (error) {
            flash('An error occurred while logging in');
            console.error('Login error:', error);
            return { success: false, redirect: '/', message: 'An error occurred while logging in' };
        }
    };

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            const response = await fetch(url + '/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                setAuthState({isAuthenticated: false, user: null});
                sessionStorage.removeItem('selectedPatient');
                setTherapistState({ patients: [], selectedPatient: null});
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

    useEffect(() => {
        console.log('therapist state changed: ', therapistState);
    }, [therapistState]);

    useEffect(() => {
        console.log('therapist of patient : ', therapistOfPatient );
    }, [therapistOfPatient]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: authState.isAuthenticated,
                user: authState.user,
                updateLoginState,
                checkLogin,
                handleLogout,
                handleLogin,
                patients: therapistState.patients,
                selectedPatient: therapistState.selectedPatient,
                fetchPatients,
                selectPatient,
                therapistOfPatient: therapistOfPatient
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
export const url = 'https://hypnobuddy-backend-eoh6trr5sq-ew.a.run.app';