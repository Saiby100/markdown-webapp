import React, { useState } from "react"
import "./styles/login.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = () => {
        alert(`Username: ${username} Password: ${password}`);
        navigate(`/notes/${username}`);
    }

    return (
        <div class="background center">
            <div class="login-bg">
                <h1>Welcome</h1>
                <form onSubmit={handleLogin} class="form-container">
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
                    <div class="links">
                        <Link to="/recoverpassword">Forgot password?</Link>
                        <Link to="/signup">Create account</Link>
                    </div>

                    <TextButton type="submit" text="Log In"/>
                </form>

            </div>
        </div>   
    );
}

export default LoginPage;