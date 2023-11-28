import {useContext} from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.tsx";  // Ensure correct import path

function LoginPage() {
    const { flash } = useContext(FlashContext);
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleLoginFromSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const emailInput = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement | null;
        const passwordInput = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement | null;

        if (emailInput && passwordInput) {
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const {success, redirect, message} = await handleLogin(email, password);

                if (success) {
                    flash(message);
                    navigate(redirect);
                } else {
                    flash(message);
                }
            } catch (error) {
                flash('An error occurred while logging in');
                console.error('Login error:', error);
            }
        } else {
            console.error('Email or password input not found');
        }

    };
    return (
        <div>
            <h1>Login</h1>
            <AuthForm onSubmit={handleLoginFromSubmit} isLogin />
        </div>
    );
}

export default LoginPage;
