import React from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";
import { TextButton, RoundIconButton } from "../components/button";

const NotePopup = ({noteTitle, noteBody}) => {
    return (
        <div class="popup-bg">
            <div class="header">
                <input type="text" placeholder={noteTitle}/>

                <div class="buttons">
                    <div class="text-buttons">
                        <TextButton text="Delete" plain={true} />
                        <TextButton text="Share" plain={true} />
                        <TextButton text="Save" />
                    </div>
                    <div class="icon-buttons">
                        <RoundIconButton icon="/x.svg"/>
                    </div>
                </div>
            </div>

            <div class="note-area">
                <textarea id="markdown"></textarea>
                <div class="note-preview"></div>
            </div>

        </div>
    );
}

const Note = ({title, body}) => {
    const handleNoteClicked = (note) => {
        // openPopup();
    }

    return (
        <div class="note-card" onClick={handleNoteClicked}>
            <h3>{title}</h3>
        </div>
    );
}

const NotesPage = () => {

    const openNewNote = () => {

    }

    return (
        <div class="background">
            <Toolbar username="Salahuddin" newNotePress={openNewNote}/>

            <div class="note-list">
                <Note 
                    title="This is a note title" 
                    body="This is the note body"/>
                <Note 
                    title="This is an even longer note title" 
                    body="This is the even longer note body"/>
            </div>

            <NotePopup noteTitle="Note Title" noteBody="This is the note body"/>
        </div>
    );
}

export default NotesPage;