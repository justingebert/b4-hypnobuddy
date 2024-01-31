import { useContext, useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';
import { useNavigate, Link } from 'react-router-dom';
import {url, useAuth} from '../contexts/AuthContext.tsx';
import '../styles/LoginSignin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
    const { flash } = useContext(FlashContext);
    const { updateLoginState } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (event: any) => {
        event.preventDefault();
        const { first, last, email, password } = event.target.elements;

        try {
            const response = await fetch(url + '/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first: first.value,
                    last: last.value,
                    email: email.value,
                    password: password.value,
                }),
            });
            const data = await response.json();
            flash(data.message);  // Display the message from the server
            console.log(data);
            flash(data.message);

            if (response.ok) {
                await updateLoginState(data.user);
            }
            navigate(data.redirect);
        } catch (error) {
            flash('An error occurred while registering');
            console.error('Registration error:', error);
        }
    };

    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };

    return (
        <div className="loginPage">
            <div className="background-login-image">
            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex flex-column justify-content-center align-items-center">
                <div className="c_dark" style={{ flexDirection: 'column' }}>
                    {isLogin ? (
                        <div>
                            <h1><b>Register</b></h1>
                            <AuthForm onSubmit={handleRegister} />
                        </div>
                    ) : (
                        <AuthForm onSubmit={handleRegister} />
                    )}
                    {isLogin ? (
                        <p className="mt-3">
                            Du hast bereits einen Account? <Link to="/login" className="link" onClick={toggleForm}><b>Login</b></Link>
                        </p>
                    ) : (
                        <p className="mt-3">
                            Du hast noch kein Account? <Link to="/register" className="link" onClick={toggleForm}>Registriere dich hier.</Link>
                        </p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default RegisterPage;
