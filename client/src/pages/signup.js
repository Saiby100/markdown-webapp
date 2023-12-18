import React, { useState } from "react"
import "./styles/signup.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const handleSignup = (form) => {
        if (password == confPassword) {
            alert(`Email: ${email} Username: ${username} Password: ${password}`);
        } else {
            alert("Passwords don't match")
            form.preventDefault();
            setPassword("");
            setConfPassword("");
        }
    }

    return (
        <div class="background center">
            <div class="signup-bg">
                <h1>Register</h1>
                <form onSubmit={handleSignup} class="form-container">
                    <TextField 
                        type="text" 
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <TextField 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <TextField 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <TextField 
                        type="password" 
                        placeholder="Confirm Password"
                        value={confPassword}
                        onChange={e => setConfPassword(e.target.value)}
                        required
                    />

                    <TextButton type="submit" text="Sign Up"/>
                </form>

            </div>
        </div>   
    );
}

export default SignupPage;