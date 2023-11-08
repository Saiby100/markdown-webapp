import React, { useState } from "react"
import "./login.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        alert(`Username: ${username} Password: ${password}`)
    }

    return (
        <div class="background">
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
                        <a href="#">Forgot password</a>
                        <a href="#">Create account</a>
                    </div>

                    <TextButton type="submit" text="Log In"/>
                </form>

            </div>
        </div>   
    );
}

export default LoginPage;