import React, { useState, useEffect } from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";
import { TextButton, RoundIconButton } from "../components/button";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { getNotes } from "../utils/DatabaseApi";

const NotePopup = ({noteTitle, noteBody, onDelete, onShare, onSave, onClose}) => {

    const [markdown, setMarkdown] = useState(noteBody);
    const [preview, setPreview] = useState("");

    const updatePreview = () => {
        const preview = marked(markdown);
        setPreview(preview);
    };

    useEffect(() => {
        updatePreview();
    }, [markdown]);

    const handleNoteUpdate = (event) => {
        const noteBody = event.target.value;
        setMarkdown(noteBody);
    };

    return (
        <div class="popup-bg">
            <div class="header">
                <input type="text" placeholder={noteTitle}/>

                <div class="buttons">
                    <div class="text-buttons">
                        <TextButton text="Delete" plain={true} onClick={onDelete}/>
                        <TextButton text="Share" plain={true} onClick={onShare}/>
                        <TextButton text="Save" onClick={onSave}/>
                    </div>
                    <div class="icon-buttons">
                        <RoundIconButton icon="/x.svg" onClick={onClose}/>
                    </div>
                </div>
            </div>

            <div class="note-area">
                <textarea 
                    id="markdown"
                    class="note-style"
                    value={markdown}
                    onChange={handleNoteUpdate}
                ></textarea>
                <div 
                    id="preview"
                    class="note-style"
                    dangerouslySetInnerHTML={{__html: preview}}
                >
                </div>
            </div>

        </div>
    );
}

const Note = ({title, ...props}) => {
    return (
        <div class="note-card" {...props}>
            <h3>{title}</h3>
        </div>
    );
}

const NotesPage = () => {
    const { userId } = useParams();
    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        updateNotes();
    }, []);
    

    const openNote = (note = null) => {
        if (note !== null) {
            setNoteTitle(note.title);
            setNoteBody(note.text);
        } else {
            setNoteTitle("Note Title");
            setNoteBody("");
        }

        setPopupVisible(true);
    }

    const closeNote = () => {
        setPopupVisible(false);
    }

    const deleteNote = () => {
        setPopupVisible(false);
        //TODO: handle delete
    }

    const saveNote = () => {
        setPopupVisible(false);
        //TODO: handle save
    }

    const shareNote = () => {
        alert("Share note")
    }

    const updateNotes = async () => {
        if (!token) {
            console.log("Failed to retrieve token");
            return;
        }

        const getNotesResponse = await getNotes(userId, token);
        if (getNotesResponse.status === 201) {
            // console.log(getNotesResponse.json);
            setNotes(getNotesResponse.json);
        } else {
            console.log(getNotesResponse.json.error)
        }
    }

    return (
        <div class="background">
            <Toolbar username="Salahuddin" newNotePress={openNote}/>

            <div class="note-list">
                {
                notes.map((note, index) => (
                    <Note key={index} title={note.title} onClick={() => openNote(note)} />
                ))
                }
            </div>
            {
                popupVisible &&
                (<NotePopup 
                    noteTitle={noteTitle}
                    noteBody={noteBody}
                    onClose={closeNote}
                    onDelete={deleteNote}
                    onShare={shareNote}
                    onSave={saveNote}
                />)
            }

        </div>
    );
}

export default NotesPage;