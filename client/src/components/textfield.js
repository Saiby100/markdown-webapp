import React from "react";
import "./textfield.scss"

const TextField = ({...props}) => {
    return (
        <input class="text-field" {...props} />        
    );
}

export {TextField};