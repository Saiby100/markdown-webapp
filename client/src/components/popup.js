import React, { useState } from "react";
import styles from "./styles/popup.module.scss";
import { TextField } from "./textfield";
import { TextButton } from "./button";

const ListItem = ({text, ...props}) => {
    return (
        <button
            {...props}
            className={`${styles.buttonitem} ${styles.hovereffect}`}
        >{text}
        </button>
    );
}

const IconListItem = ({text, icon, ...props}) => {
    return (
        <div 
            className={`${styles.buttonitem} ${styles.hovereffect} ${styles.iconproperties}`}
            {...props}
        >
            <img src={icon} alt={"icon"} />
            <p>{text}</p>
        </div>
    );
}

const IconMenuList = ({options}) => {
    const listOptions = options.length? [...options] : [{text: "None", 
        icon: "/profile.svg"}];

    const handleButtonClick = (option) => {
        if (!option.onClick) {
            console.log(`No action specified for ${option.text}`);
        } else {
            option.onClick();
        }
    };


    return (
        <div className={`${styles.container} popup`}>
        {listOptions.map((option, index) => (
            <IconListItem
            key={index}
            text={option.text}
            icon={option.icon}
            onClick={() => handleButtonClick(option)}
            />
        ))}
        </div>
    );

}

const MenuList = ({ options }) => {
    const listOptions = options.length? [...options] : [{text: "None"}];

    const handleButtonClick = (option) => {
        if (!option.onClick) {
            console.log(`No action specified for ${option.text}`);
        } else {
            option.onClick();
        }
    };

    return (
        <div className={`${styles.container} popup`}>
        {listOptions.map((option, index) => (
            <ListItem
            key={index}
            text={option.text}
            onClick={() => handleButtonClick(option)}
            />
        ))}
        </div>
    );
};

const MenuListInput = ({options, inputField}) => {
    const [inputText, setInputText] = useState(inputField.value? inputField.value : "");

    const handleItemClick = (itemText) => {
        setInputText(itemText);
    };

    const handlebuttonClick = () => {
        if (!inputField.onClick) {
            console.log("No button action specified.");
        } else {
            inputField.onClick(inputText);
        }
    };

    return (
        <div className={`${styles.container}`}>
            {options.map((option, index) => (
                <ListItem 
                    key={index} 
                    text={option} 
                    onClick={() => handleItemClick(option)}/>
            ))}
            <div className={`${styles.inputcontainer}`}>
                <TextField 
                    placeholder={inputField.placeholder? inputField.placeholder : "Text Here"}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}/>
                <TextButton 
                    text={inputField.buttonText? inputField.buttonText : "Done"} 
                    onClick={handlebuttonClick}/>
            </div>
        </div>
    );
};

const ChoiceMenu = ({options, textPrompt}) => {
    return (
        <div className={`${styles.container} ${styles.choicemenu}`}>
            <h2>{textPrompt}</h2>
            <div className={`${styles.flexrow}`}>
                {options.map((option, index) => (
                    <TextButton 
                        key={index}
                        text={option.text} 
                        plain={!option.highlight} 
                        onClick={option.onClick}/>
                ))}
            </div>
        </div>
    )

}

export {MenuList, MenuListInput, ChoiceMenu, IconMenuList};