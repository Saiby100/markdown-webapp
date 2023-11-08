import React from "react";
import { TextButton } from "./button";
import "./styles/toolbar.scss"

const Toolbar = ({username, newNotePress}) => {

    const handleNewNotePress = () => {
        newNotePress();
    }
    return (
        <div class="container">
            <div class="profile-container">
                <img src="/profile.svg" alt="profile" />
                <h1>{username}</h1>
            </div>
            <TextButton 
                text="New Note" 
                onClick={handleNewNotePress}
            />
        </div>
    );
}

export default Toolbar;