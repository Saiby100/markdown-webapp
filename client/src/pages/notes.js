import React from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";

const NotePopup = ({noteTitle, noteBody}) => {
    return (
        <div>

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

    return (
        <div class="notes-background">
            <Toolbar username="Salahuddin" />

            <div class="note-list">
                <Note 
                    title="This is a note title" 
                    body="This is the note body"/>
                <Note 
                    title="This is an even longer note title" 
                    body="This is the even longer note body"/>
            </div>
        </div>
    );
}

export default NotesPage;