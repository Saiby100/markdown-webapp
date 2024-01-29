import React, { useState, useEffect } from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";
import { TextButton, RoundIconButton } from "../components/button";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { addNote, getNotes, updateNote, deleteNote, shareNote } from "../utils/DatabaseApi";
import { TextField } from "../components/textfield";
import showToast from "../components/toast";

const NotePopup = ({
    noteTitle,
    noteBody,
    handleTitleUpdate, 
    handleNoteUpdate, 
    onDelete, 
    onShare, 
    onSave, 
    onClose
}) => {

    const [markdown, setMarkdown] = useState(noteBody);
    const [preview, setPreview] = useState("");

    const updatePreview = () => {
        const preview = marked(markdown);
        setPreview(preview);
    };

    useEffect(() => {
        updatePreview();
    }, [markdown]);

    const noteUpdate = (event) => {
        const noteBody = event.target.value;
        setMarkdown(noteBody);
        handleNoteUpdate(noteBody);
    };

    return (
        <div class="popup-bg">
            <div class="header">
                <input type="text" placeholder={noteTitle} onChange={handleTitleUpdate}/>

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
                    onChange={noteUpdate}
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

const ShareListPopup = ({handleSend, sharedList}) => {
    const [newUsername, setNewUsername] = useState("");

    return (
        <div class="share-list">
            {
            sharedList.map((name, index) => (
                <p onClick={() => handleSend(name)}>{name}</p>
            ))
            }
            <div class="input-container">
                <TextField 
                    placeholder="New User" 
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}/>
                <TextButton text="Send" onClick={() => handleSend(newUsername)}/>
            </div>
        </div>

    );
}

const NotesPage = () => {
    const { userId } = useParams();
    const token = localStorage.getItem("authToken");

    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");

    const [popupVisible, setPopupVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [noteIsNew, setNoteIsNew] = useState(false);
    const [noteId, setNoteId] = useState(-1);

    const [sharedList, setsharedList] = useState([]);
    const [shareListVisible, setShareListVisible] = useState(false);

    useEffect(() => {
        updateNotes();
    }, [popupVisible]);
    

    const openNote = (note = null) => {
        if (note !== null) {
            setNoteTitle(note.title);
            setNoteBody(note.text);
            setNoteId(note.noteid);
            setNoteIsNew(false);
        } else {
            setNoteTitle("Note Title");
            setNoteBody("");
            setNoteIsNew(true);
        }

        setPopupVisible(true);
    }

    const closeNote = () => {
        setPopupVisible(false);
        setShareListVisible(false);
    }

    const deleteUserNote = async () => {
        const deleteNoteRequest = await deleteNote(noteId, userId, token);

        if (deleteNoteRequest.status === 201) {
            showToast.success(deleteNoteRequest.json.message);
        } else {
            showToast.error(deleteNoteRequest.json.error);
        }
        closeNote();
    }

    const saveNote = async () => {
        if (noteIsNew) {
            const addNoteRequest = await addNote(userId, noteTitle, noteBody, token);
            if (addNoteRequest.status === 201) {
                showToast.success(addNoteRequest.json.message);
            } else {
                showToast.error(addNoteRequest.json.error);
            }
        } else {
            const updateNoteRequest = await updateNote(noteId, noteTitle, noteBody, token);
            if (updateNoteRequest.status === 201) {
                showToast.success(updateNoteRequest.json.message);
            } else {
                showToast.error(updateNoteRequest.json.error);
            }
        }
        closeNote();
    }

    const shareButtonPress = async (username) => {
        const shareNoteRequest = await shareNote(userId, username, noteId, token);

        if (shareNoteRequest.status === 201) {
            if (!sharedList.includes(username)) {
                setsharedList(prevArray => [...prevArray, username]); //Append onto the array
            }
            setShareListVisible(false);

            showToast.success(shareNoteRequest.json.message);
        } else {
            showToast.error(shareNoteRequest.json.error);
        }

    }

    const updateNotes = async () => {
        if (!token) {
            console.log("Failed to retrieve token");
            return;
        }

        const getNotesResponse = await getNotes(userId, token);
        if (getNotesResponse.status === 201) {
            setNotes(getNotesResponse.json);
        } else {
            console.log(getNotesResponse.json.error)
        }
    }

    const handleNoteUpdate = (newBody) => {
        setNoteBody(newBody);
    }

    const handleTitleUpdate = (event) => {
        setNoteTitle(event.target.value);
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
                    handleNoteUpdate={handleNoteUpdate}
                    handleTitleUpdate={handleTitleUpdate}
                    onClose={closeNote}
                    onDelete={deleteUserNote}
                    onShare={() => setShareListVisible(!shareListVisible)}
                    onSave={saveNote}
                />)
            }

            {
                shareListVisible &&
                (<ShareListPopup sharedList={sharedList} handleSend={shareButtonPress}/>)
            }
        </div>
    );
}

export default NotesPage;