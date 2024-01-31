// LoginCombined.tsx
import React, { useContext, useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterPage';
import '../styles/LoginSignin.scss';

const LoginPage = () => {
    const { flash } = useContext(FlashContext);
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleLoginFromSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const emailInput = (event.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement | null;
        const passwordInput = (event.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement | null;

        if (emailInput && passwordInput) {
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const { success, redirect, message } = await handleLogin(email, password);

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

    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };

    return (
        <div className="loginPage">
            <div className="background-login-image">

                <div className="centered-container">
                    <div className="c_dark" style={{ flexDirection: 'column' }}>
                        {isLogin ? (
                            <div>
                                <h1><b>Login</b></h1>
                                <AuthForm onSubmit={handleLoginFromSubmit} isLogin />
                            </div>
                        ) : (
                            <RegisterForm />
                        )}
                        {isLogin ? (
                            <p className="mt-3">
                                Du hast noch kein Account? <Link to="/register" className="link" onClick={toggleForm}>Registriere dich hier.</Link>
                            </p>
                        ) : (
                            <p className="mt-3">
                                Du hast bereits einen Account? <Link to="/loginsignin " className="link" onClick={toggleForm}>Login hier.</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
