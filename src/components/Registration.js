import React,{useState} from 'react';
import './Registration.css'
const Registration = () => {
    const [Name,setName]=useState('');
    const [Email,setEmail]=useState('');
    const [Phone,setPhone]=useState('');
    const [Password,setPassword]=useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (Name && Email && Phone && Password)
        {
            console.log("Registered")
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');


        }
        else{
            alert("please fill all fields")
        }
    }
    return(
        <div>
            <center><header>
                <h1>Welcome!</h1>
            </header>
            </center>
            <main>
                <center><h2>Package Tracking System</h2>
                <h2>Registeration</h2></center>
            </main>
            <center>
            <form onSubmit={handleSubmit}>
            <div >
                <label>Username:</label>
                <input type="text" placeholder='Enter Name' value={Name} required onChange={(e) => setName(e.target.value)}/>
                <br/>
                <label>Email:</label>
                <input type="text" placeholder='Enter Email'value={Email} required onChange={(e) => setEmail(e.target.value)}/>
                <br/>
                <label>Mobile number:</label>
                <input type="tel" placeholder='Enter Phone number'value={Phone} required onChange={(e) => setPhone(e.target.value)}/>
                <br/>
                <label>Password:</label>
                <input type="password" placeholder='Enter Password'value={Password} required onChange={(e) => setPassword(e.target.value)}/>
                <br/>
                <button type="submit">Register</button>
            </div>
            </form>
           </center>
        </div>
    );
}

export default Registration;