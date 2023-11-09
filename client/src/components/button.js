import React from "react";
import styles from "./styles/button.module.scss";

const TextButton = ({text, ...props}) => {
    return (
        <button
            {...props}
            className={styles.textbtn} 
        >{text}</button>
    );
}

export {TextButton};