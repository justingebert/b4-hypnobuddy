import { useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { FlashProvider } from './contexts/FlashContext';
import './styles/App.css';
import DashboardPage from "./pages/DashboardPage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    //const { flash } = useContext(FlashContext);
    const [isLoggedIn, setIsLoggedIn] = useState({isAuthenticated: false, user: null});

    const updateLoginState = async (user: any) => {
        await checkLogin();
        setIsLoggedIn({isAuthenticated: true, user: user});
    };
    const checkLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/c', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.isAuthenticated) {
                setIsLoggedIn({ isAuthenticated: true, user: data.user });
            }
        } catch (error) {
            console.error('Error fetching auth status:', error);
        }
    };

    useEffect(() => {
        console.log('Authentication state changed:', isLoggedIn);
    }, [isLoggedIn]);


    useEffect(() => {
        checkLogin();
    }, []);
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            //const data = await response.json();
            if (response.ok) {
                setIsLoggedIn({isAuthenticated: false, user: null});
                //flash(data.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <FlashProvider>
            <Router>
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
                <Routes>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/login" element={<LoginPage onLoginSuccess={updateLoginState} />}/>
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </FlashProvider>
    );
}

export default App;
