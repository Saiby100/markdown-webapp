import React from "react";
import { TextButton } from "./button";
import styles from "./styles/toolbar.module.scss"

const Toolbar = ({username, newNotePress}) => {

    const handleNewNotePress = () => {
        newNotePress();
    }
    return (
        <div className={styles.container}>
            <div className={styles.profilecontainer}>
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