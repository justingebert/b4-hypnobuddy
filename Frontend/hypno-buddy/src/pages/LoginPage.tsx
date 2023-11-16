import {useContext} from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.tsx";  // Ensure correct import path

function LoginPage() {
    const { flash } = useContext(FlashContext);  // Access flash function from context
    const { updateLoginState } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event:any) => {
        event.preventDefault();
        const { email, password } = event.target.elements;

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                await updateLoginState(data.user);
                flash(data.message);  // Display the success message from the server
                navigate(data.redirect);
            } else {
                flash(data.message || 'An error occurred while logging in');
            }
            navigate(data.redirect);
        } catch (error) {
            flash('An error occurred while logging in');
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <AuthForm onSubmit={handleLogin} isLogin />
        </div>
    );
}

export default LoginPage;
