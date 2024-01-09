import React from "react";
import styles from "./styles/textfield.module.scss"

const TextField = ({...props}) => {
    return (
        <input className={styles.textfield} {...props} />        
    );
}

export {TextField};