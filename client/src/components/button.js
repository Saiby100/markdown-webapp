import React from "react";
import styles from "./styles/button.module.scss";

const TextButton = ({text, plain, ...props}) => {
    const buttonColour = plain ? styles.plain : styles.gradient;

    return (
        <button
            {...props}
            className={`${styles.textbtn} ${buttonColour}`} 
        >{text}</button>
    );
}

const RoundIconButton = ({icon, ...props}) => {
    return (
        <button
        {...props}
        className={`${styles.plain} ${styles.round}`}
        >
            <img src={icon} alt="close" />
        </button>
    );
}


export {TextButton, RoundIconButton};