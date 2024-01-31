import React from "react";
import styles from "./styles/button.module.scss";

const TextButton = ({text, plain, ...props}) => {
    const buttonColour = plain ? styles.grey : styles.gradient;

    return (
        <button
            {...props}
            className={`${styles.textbtn} ${buttonColour}`} 
        >{text}</button>
    );
}

const IconButton = ({icon, ...props}) => {
    return (
        <button
            {...props}
            className={`${styles.plain} ${styles.scale}`}
        >
            <img src={icon} alt="options" />
        </button>
    )
}

const RoundIconButton = ({icon, ...props}) => {
    return (
        <button
        {...props}
        className={`${styles.plain} ${styles.round} ${styles.grey} ${styles.scale}`}
        >
            <img src={icon} alt="close" />
        </button>
    );
}


export {TextButton, IconButton, RoundIconButton};