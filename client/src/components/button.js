import React from "react";
import styles from "./styles/button.module.scss";

const TextButton = ({text, plain, ...props}) => {
    const buttonColour = plain ? styles.grey : styles.gradient;

    return (
        <button
            {...props}
            className={`${styles.textbtn} ${buttonColour} ${styles.hovereffect}`} 
        >{text}</button>
    );
}

const RoundIconButton = ({icon, alt, ...props}) => {
    return (
        <button
        {...props}
        className={`${styles.plain} ${styles.round} ${styles.scale}`}
        >
            <img src={icon} alt={alt} />
        </button>
    );
}


export {TextButton, RoundIconButton};