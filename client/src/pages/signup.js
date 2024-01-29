import React, { useState } from "react"
import "./styles/signup.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../utils/DatabaseApi";
import showToast from "../components/toast";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (form) => {
        form.preventDefault();
        if (password === confPassword) {
            const signupResponse = await signupUser(email, username, password);

            if (signupResponse.status === 201) {
                showToast.success(signupResponse.json.message);
                navigate('/');

            } else {
                showToast.error(signupResponse.json.error);
            }

        } else {
            alert("Passwords don't match")
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