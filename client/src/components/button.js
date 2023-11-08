import React from "react";
import "./styles/button.scss";

const TextButton = ({text, ...props}) => {
    return (
        <button
            {...props}
            class="text-button"
        >{text}</button>
    );
}

export {TextButton};