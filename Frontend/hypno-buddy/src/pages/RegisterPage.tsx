import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.tsx';
import { FlashContext } from '../contexts/FlashContext';


function RegisterPage() {
    const { flash } = useContext(FlashContext);
    const navigate = useNavigate();
    const handleRegister = async (event:any) => {
        event.preventDefault();
        const { first, last, email, password } = event.target.elements;

        try {
            const response = await fetch('http://localhost:3000/user/create', {
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
            console.log(data);
            flash(data.message);  // Display the message from the server

            navigate(data.redirect);

    } catch (error) {
        flash('An error occurred while registering');
        console.error('Registration error:', error);
    }
    };

    return (
        <div>
            <h1>Register</h1>
            <AuthForm onSubmit={handleRegister} />
        </div>
    );
}

export default RegisterPage;
