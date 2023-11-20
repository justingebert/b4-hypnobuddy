import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { FlashProvider } from './contexts/FlashContext';
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import './styles/App.css';
import DashboardPage from "./pages/DashboardPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import DosAndDontsPage from "./pages/DosAndDontsPage.tsx";
import RoadmapPage from "./pages/RoadmapPage.tsx";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginSignin from "./pages/LoginSignin.tsx"
import SigninPage from "./pages/SigninPage.tsx";

function App() {

    const { checkLogin } = useAuth();
    useEffect(() => { checkLogin(); }, []);


    return (
        <FlashProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/register" element={<SigninPage />} />
                    <Route path="/login" element={<LoginSignin />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dosanddonts" element={<DosAndDontsPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />

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
