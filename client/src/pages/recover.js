import React, { useState } from "react";
import "./styles/recover.scss";
import { TextField } from "../components/textfield";
import { TextButton } from "../components/button";

const RecoverPage = () => {
    const [email, setEmail] = useState("");

    const handleRecoverPassword = () => {
        alert(`Email: ${email}`)
    }

    return (
        <div class="background center">
            <div class="recover-bg">
                <h1>Recover Password</h1>
                <form onSubmit={handleRecoverPassword} class="form-container">
                    <TextField 
                        type="text" 
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <TextButton type="submit" text="Send Email"/>
                </form>
            </div>
        </div>   
    );
}

export default RecoverPage;