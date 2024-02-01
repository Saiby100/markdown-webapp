import React from "react";
import { RoundIconButton, ProfileButton } from "./button";
import styles from "./styles/toolbar.module.scss"

const Toolbar = ({username, toolFunctions}) => {

    return (
        <div className={styles.container}>
            <div className={styles.profilecontainer}>
                <ProfileButton icon={"/tree.png"} onClick={() => alert("Tree icon pressed")}/>
                <h1>{username}</h1>
            </div>
            <div className={`${styles.toolicons}`}>
                <RoundIconButton 
                    icon={"/search.svg"}
                    alt={"search"}
                    onClick={() => toolFunctions.searchPress()}/>
                <RoundIconButton 
                    icon={"/add.svg"}
                    alt={"add note"}
                    onClick={() => toolFunctions.newNotePress()}/>
            </div>
        </div>
    );
}

export default Toolbar;