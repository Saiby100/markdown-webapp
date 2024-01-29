import React, { useState } from "react"
import "./styles/login.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/DatabaseApi"
import showToast from "../components/toast";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault()
        const loginResponse = await loginUser(username, password);

        if (loginResponse.status === 201) {
            if (!loginResponse.json.userId) {
                showToast.error("No ID received from server");
            } else {
                showToast.success(loginResponse.json.message);
                localStorage.setItem("authToken", loginResponse.json.token);
                localStorage.setItem("username", username);
                navigate(`/notes/${loginResponse.json.userId}`);
            }
        } else {
            console.log(loginResponse);
            showToast.error(loginResponse.json.error);
        }
    }

    return (
        <div class="background center">
            <div class="login-bg">
                <h1>Welcome</h1>
                <form onSubmit={(e) => handleLogin(e)} class="form-container">
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