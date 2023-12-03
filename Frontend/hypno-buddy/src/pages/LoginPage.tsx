// LoginCombined.tsx
import React, { useContext, useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterPage';
import Lottie, { AnimationConfigWithData } from 'lottie-web';
import LoginAnimation from '../assets/LoginAnimation.json';
import styled from 'styled-components';
import '../styles/LoginSignin.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomeHeading = styled.div`
    color: #f4e7e8;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    margin: auto 0;
    font: 700 90px/109px Inter, sans-serif;

    position: absolute;
    top: 45%;
    left: 15%;
`;
const Container = styled.div`
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: relative;
`;

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

    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };
    const defaultOptions: AnimationConfigWithData<'svg'> = {
        loop: true,
        autoplay: true,
        animationData: LoginAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Container>
            <Lottie options={defaultOptions} height="100%" width="100%" className="position-absolute" />
            <WelcomeHeading className="display-1">Willkommen</WelcomeHeading>
            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center">
                <div className="c_dark" style={{ flexDirection: 'column' }}>
                    {isLogin ? (
                        <div>
                            <h1>Login</h1>
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
        </Container>
    );
};

export default LoginPage;
