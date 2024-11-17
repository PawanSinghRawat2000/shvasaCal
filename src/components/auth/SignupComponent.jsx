import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupComponent({ setShowLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Password mismatch");
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/emailSignup`, {
            method: "POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            alert("User already exists");
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <form method="POST" onSubmit={handleEmailSignup}>
            <div className="authLeft">
                <div className="authPopup">
                    <div className="authPopupHeading">Sign up for free</div>
                    <div className="authSocial">
                        <div className="authInput">
                            <p>Email Address</p>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="authInput">
                            <p>Password</p>
                            <div className="passwordInput">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                        <div className="authInput">
                            <p>Confirm Password</p>
                            <div className="passwordInput">
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="authTerms">
                        <input type="checkbox" required />
                        <p>
                            I've read and agreed to{" "}
                            <Link>Terms & Conditions</Link>
                        </p>
                    </div>
                    <button className="authSignin" type="submit">
                        Sign Up
                    </button>
                    <p className="authNewText">
                        Already have an account?{" "}
                        <span onClick={() => setShowLogin(true)}> Sign in</span>
                    </p>
                </div>
            </div>
        </form>
    );
}

export default SignupComponent;
