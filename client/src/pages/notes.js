import React, { useState, useEffect, useRef } from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";
import { TextButton, RoundIconButton, IconButton } from "../components/button";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { addNote, getNotes, updateNote, deleteNote, shareNote } from "../utils/DatabaseApi";
import showToast from "../components/toast";
import { ChoiceMenu, MenuList, MenuListInput } from "../components/popup";
import { io } from "socket.io-client";
import ClickAwayListener from "react-click-away-listener";

const NotePopup = ({
    noteTitle,
    noteBody,
    handleTitleUpdate, 
    handleNoteUpdate, 
    onDelete, 
    handleShare, 
    onSave, 
    onClose
}) => {

    const [markdown, setMarkdown] = useState(noteBody);
    const [preview, setPreview] = useState("");

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewBtn, setPreviewBtn] = useState("Preview");

    const [sharePopupVisible, setSharePopupVisible] = useState(false);
    const [sharedList, setSharedList] = useState([]);

    const [discardPopupVisible, setDiscardPopupVisible] = useState(false);
    const [noteChanged, setNoteChanged] = useState(false);
    const discardOptions = [
        {text: "No! Save it", highlight: true, onClick: () => {
            onSave();
        }},
        {text: "I'm Sure", highlight: false, onClick: () => {
            onClose();
        }}
    ]

    const inputOptions = {
        placeholder: "New User",
        onClick: (username) => {
            if (handleShare(username)) {
                if (!sharedList.includes(username)) {
                    setSharedList(prevValues => [...prevValues, username]);
                }
                setSharePopupVisible(false);
            }
        }
    };

    const [menuPopupVisible, setMenuPopupVisible] = useState(false);
    const menuOptions = [
        {text: "Save", onClick: () => {
            onSave();
        }},
        {text: "Share", onClick: () => {
            setSharePopupVisible(!sharePopupVisible);
            setMenuPopupVisible(false);
        }},
        {text: "Delete", onClick: () => {
            onDelete();
        }}
    ];

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
        setNoteChanged(true);
    };

    const showPreview = () => {
        setPreviewVisible(!previewVisible);
        if (!previewVisible) {
            setPreviewBtn("Edit");
        } else {
            setPreviewBtn("Preview");
        }
    }

    const handleNoteClose = () => {
        if (noteChanged) {
            setDiscardPopupVisible(true);
        } else {
            onClose();
        }
    }

    return (
        <div class="popup-bg">
            <div class="header">
                <div class="header-left">
                    <RoundIconButton icon="/x.svg" alt="close" onClick={handleNoteClose}/>
                    <input type="text" placeholder={noteTitle} onChange={handleTitleUpdate}/>
                </div>
                <div class="header-right">
                    <TextButton text={previewBtn} onClick={showPreview}/>
                    <RoundIconButton 
                        icon="/options.svg" 
                        alt="options"
                        onClick={() => setMenuPopupVisible(!menuPopupVisible)}/>
                </div>
            </div>
            {
                !previewVisible && 
                (
                    <textarea 
                        id="markdown"
                        class="note-style"
                        value={markdown}
                        onChange={noteUpdate}
                    ></textarea>
                )
            }
            {
                previewVisible && 
                (
                    <div 
                        id="preview"
                        class="note-style"
                        dangerouslySetInnerHTML={{__html: preview}}
                    >
                    </div>
                )
            }
            {
                sharePopupVisible &&
                (
                    <ClickAwayListener onClickAway={() => setSharePopupVisible(false)}>
                        <div>
                            <MenuListInput options={sharedList} inputField={inputOptions} />
                        </div>
                    </ClickAwayListener>
                )
            }
            {
                menuPopupVisible &&
                (
                    <ClickAwayListener onClickAway={() => setMenuPopupVisible(false)}>
                        <div>
                            <MenuList options={menuOptions}/>
                        </div>
                    </ClickAwayListener>
                )
            }
            {
                discardPopupVisible &&
                (
                    <ClickAwayListener onClickAway={() => setDiscardPopupVisible(false)}>
                        <div>
                            <ChoiceMenu options={discardOptions} textPrompt={"Are you sure you want to discard your changes?"}/>
                        </div>
                    </ClickAwayListener>
                )
            }
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
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");

    const [popupVisible, setPopupVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [noteIsNew, setNoteIsNew] = useState(false);
    const [noteId, setNoteId] = useState(-1);

    const [socket, setSocket] = useState(null);

    const [allUsers, setAllUsers] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);

    useEffect(() => {
        updateNotes();
    }, [popupVisible]);

    const initSocket = () => {
        const newSocket = io("http://localhost:3000");

        newSocket.on("connect", () => {
            console.log("You have connected to the server.");
        });

        newSocket.emit("join-note", noteId, username);
        setSocket(newSocket);

        newSocket.on("new-connection", (allUsers) => {
            if (allUsers.length == 0) {
                newSocket.emit("note-init", noteId, noteTitle, noteBody);
            } else {
                console.log("Not first user");
                newSocket.emit("get-latest-note", noteId);
            }

            const array = [];
            for (const user of allUsers) {
                const userIcon = {
                    name: user,
                    icon: "/icon.png"
                };
                array.push(userIcon);
            }
            setConnectedUsers(array);

            console.log("I just connected, clients are:", allUsers);
        });


    }

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

    const handleShareNote = async (username) => {
        const shareNoteRequest = await shareNote(userId, username, noteId, token);

        if (shareNoteRequest.status === 201) {
            showToast.success(shareNoteRequest.json.message);
        } else {
            showToast.error(shareNoteRequest.json.error);
        }

        return shareNoteRequest === 201
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
            <Toolbar username={username} newNotePress={openNote}/>

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
                    handleShare={handleShareNote}
                    onSave={saveNote}
                />)
            }

        </div>
    );
}

export default NotesPage;