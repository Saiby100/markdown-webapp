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

const RoundIconButton = ({icon, plain, alt, ...props}) => {
    const buttonColour = plain ? styles.nobg : styles.gradient;

    return (
        <button
        {...props}
        className={`
            ${styles.plain} 
            ${styles.round} 
            ${styles.scale} 
            ${buttonColour}
            ${styles.hovereffect}
        `}
        >
            <img src={icon} alt={alt} />
        </button>
    );
}

const ProfileButton = ({icon, plain, alt, ...props}) => {

    return (
        <button
        {...props}
        className={`
            ${styles.plain} 
            ${styles.scale} 
            ${styles.round} 
            ${styles.fitimage} 
        `}
        >
            <img src={icon} alt={alt} />
        </button>
    );
}


export {TextButton, RoundIconButton, ProfileButton};