import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FlashProvider } from './contexts/FlashContext';
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import './styles/App.css';
import DashboardPage from "./pages/DashboardPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import DosAndDontsPage from "./pages/DosAndDontsPage.tsx";
import RoadmapPage from "./pages/RoadmapPage.tsx";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx";

function App() {

    const { checkLogin } = useAuth();
    useEffect(() => { checkLogin(); }, []);

    return (
        <FlashProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dosanddonts" element={<DosAndDontsPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />

                    {/* Add other routes here */}
                </Routes>
                <Footer/>
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
