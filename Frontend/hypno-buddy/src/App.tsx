import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
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
import FearPage from "./pages/FearPage.tsx";
import DosAndDontsPatientPage from "./pages/DosAndDontsPatientPage.tsx";
import QueueView from "./pages/QueueView.tsx";
import { GoalsProvider } from "./contexts/GoalContext.tsx";

function App() {

    const { checkLogin } = useAuth();
    useEffect(() => { checkLogin(); }, []);


    return (
        <FlashProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dosanddonts//*" element={<DosAndDontsRoutes />} />
                    <Route path="/roadmap" element={
                        <GoalsProvider>
                            <RoadmapPage />
                        </GoalsProvider>
                    } />
                    <Route path="/goalQueueView" element={
                        <GoalsProvider>
                            <QueueView />
                        </GoalsProvider>
                    } />
                    <Route path="*" element={<h1>Not Found</h1>} />
                    {/* Add other routes here */}
                    {/* Add other routes here */}
                </Routes >
                <Footer />
            </Router >
        </FlashProvider >
    );
}
function DosAndDontsRoutes() {
    const { user } = useAuth();

    if (user && user.role === 'therapist') {
        return (
            <Routes>
                <Route path="/t" element={<DosAndDontsPage />} />
                <Route path="/t/:fearId" element={<FearPage />} />
            </Routes>
        );
    } else if (user && user.role === 'patient') {
        return (
            <Routes>
                <Route path="/p/" element={<DosAndDontsPatientPage />} />;
            </Routes>
        )

    } else {
        return null;
    }
}

function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}


export default AppWrapper;
