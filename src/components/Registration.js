import React, { useState } from 'react';
import './Registration.css';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [Password, setPassword] = useState('');
    const Navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Name && Email && Phone && Password) {
            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: Name, email: Email, phone: Phone, password: Password }),
                });

                if (response.ok) {
                    alert("User Registered Successfully");
                    Navigate("/Login")
                }
                else {
                    const errorData = await response.json();
                    alert(errorData)
                }
            } catch (error) {
                alert('An error occurred while registering. Please try again.')
            }
        } else {
            alert("Please fill all fields");
        }
    };

    return (
        <div>
            <center><header>
                <h1>Welcome!</h1>
            </header></center>
            <main>
                <center>
                    <h2>Package Tracking System</h2>
                    <h2>Registration</h2>
                </center>
            </main>
            <center>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" placeholder='Enter Name' value={Name} required onChange={(e) => setName(e.target.value)} />
                        <br />
                        <label>Email:</label>
                        <input type="email" placeholder='Enter Email' value={Email} required onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <label>Mobile number:</label>
                        <input type="tel" placeholder='Enter Phone number' value={Phone} required onChange={(e) => setPhone(e.target.value)} />
                        <br />
                        <label>Password:</label>
                        <input type="password" placeholder='Enter Password' value={Password} required onChange={(e) => setPassword(e.target.value)} />
                        <br />
                        <button type="submit">Register</button>
                        <br/>
                        <label className="inline-label">Are you already a member?</label>
                        <a href='/Login'>Login</a>
                    </div>
                </form>
            </center>
        </div>
    );
}

export default Registration;
