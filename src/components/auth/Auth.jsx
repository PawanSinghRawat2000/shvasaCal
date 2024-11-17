import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import LoginComponent from './LoginComponent';
import SignupComponent from './SignupComponent';

function Auth() {
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    return (
        <section className="authLogin">
            {showLogin ? (
                <LoginComponent
                    setShowLogin={setShowLogin}
                />
            ) : (
                <SignupComponent
                    setShowLogin={setShowLogin}
                />
            )}
        </section>
    );
}



export default Auth
