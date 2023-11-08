import React from "react";
import "./styles/textfield.scss"

const TextField = ({...props}) => {
    return (
        <input class="text-field" {...props} />        
    );
}

export {TextField};