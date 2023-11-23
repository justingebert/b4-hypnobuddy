//import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginPage';
import RegisterForm from './RegisterPage';
import Lottie, { AnimationConfigWithData } from 'react-lottie';
import LoginAnimation from '../assets/LoginAnimation.json';
import {useState} from "react";
import styled from "styled-components";
import '../styles/LoginSignin.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomeHeading = styled.div`
  color: #f4e7e8;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin: auto 0;
  font: 700 90px/109px Inter, sans-serif;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
    font-size: 40px;
    line-height: 54px;
  }

  position: absolute;
  top: 350px;
  left: 95px;
`;

const SigninPage = () => {
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
        <div className="position-relative vw-100 vh-100 overflow-hidden">
            <Lottie options={defaultOptions} height="100%" width="100%" className="position-absolute" />
            <WelcomeHeading className="display-1">Willkommen</WelcomeHeading>
            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center">
                <div className="c_dark" style={{ flexDirection: 'column' }}>
                    {isLogin ? <RegisterForm /> : <LoginForm />}
                    {isLogin ? (
                        <p className="mt-3">
                            Du hast bereits einen Account? <Link to="/login" className="link" onClick={toggleForm}>Login hier.</Link>
                        </p>
                    ) : (
                        <p className="mt-3">
                            Du hast noch kein Account? <Link to="/register" className="link" onClick={toggleForm}>Registriere dich hier.</Link>
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};
export default SigninPage;
