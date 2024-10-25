import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Email && Password) {
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: Email, password: Password }),
                });

                if (response.ok) {
                    alert("Login Successful");
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                alert('An error occurred while logging in. Please try again.');
            }
        } else {
            alert("Please fill all fields");
        }
    };

    return (
        <div>
            <center>
                <header>
                    <h1>Welcome Back!</h1>
                </header>
            </center>
            <main>
                <center>
                    <h2>Login</h2>
                </center>
            </main>
            <center>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input type="email" placeholder='Enter Email' value={Email} required onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <label>Password:</label>
                        <input type="password" placeholder='Enter Password' value={Password} required onChange={(e) => setPassword(e.target.value)} />
                        <br />
                        <button type="submit">Login</button>
                    </div>
                </form>
            </center>
        </div>
    );
}

export default Login;
