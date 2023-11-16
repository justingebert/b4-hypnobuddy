//import { useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { FlashProvider } from './contexts/FlashContext';
import { AuthProvider, useAuth} from "./contexts/AuthContext.tsx";
import './styles/App.css';
import DashboardPage from "./pages/DashboardPage.tsx";
import {useEffect} from "react";


function App() {

    //const { flash } = useContext(FlashContext);
    const { isAuthenticated, updateLoginState, checkLogin, handleLogout } = useAuth();
    useEffect(() => { checkLogin(); }, []);


    return (
        <FlashProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/login" element={<LoginPage />}/>
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </FlashProvider>
    );
}
function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}


export default AppWrapper;
