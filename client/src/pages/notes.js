import React, { useState, useEffect } from "react";
import "./styles/notes.scss"
import Toolbar from "../components/toolbar";
import { TextButton, RoundIconButton } from "../components/button";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import { addNote, getNotes, updateNote, deleteNote, shareNote } from "../utils/DatabaseApi";
import showToast from "../components/toast";
import { IconMenuList, MenuList, MenuListInput } from "../components/popup";
import { io } from "socket.io-client";
import ClickAwayListener from "react-click-away-listener";

const NotePopup = ({
    username,
    note,
    functions
}) => {

    const [noteTitle, setNoteTitle] = useState(note.title);
    const [markdown, setMarkdown] = useState(note.text);
    const [preview, setPreview] = useState("");

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewBtn, setPreviewBtn] = useState("Preview");

    const [sharePopupVisible, setSharePopupVisible] = useState(false);
    const [sharedList, setSharedList] = useState([]);
    const inputOptions = {
        placeholder: "New User",
        buttonText: "Share",
        onClick: (username) => {
            if (functions.handleShare(username)) {
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
            functions.handleSave();
            setMenuPopupVisible(false);
        }},
        {text: "Share", onClick: () => {
            setSharePopupVisible(!sharePopupVisible);
            setMenuPopupVisible(false);
        }},
        {text: "Delete", onClick: () => {
            functions.handleDelete();
        }},
        {text: "View Users", onClick: () => {
            setUsersPopupVisible(true);
            setMenuPopupVisible(false);
        }}
    ];

    const [usersPopupVisible, setUsersPopupVisible] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);

    const [socket, setSocket] = useState(null);
    const [useSocket, setUseSocket] = useState(note.noteid > 0);

    const [allUsers, setAllUsers] = useState([]);

    const updatePreview = () => {
        const preview = marked(markdown);
        setPreview(preview);
    };

    useEffect(() => {
        updatePreview();
    }, [markdown]);

    useEffect(() => {
        if (useSocket) {
            const newSocket = io("http://localhost:8008");

            newSocket.on("connect", () => {
                console.log("You have connected to the server.");
            });

            newSocket.emit("join-note", note.noteid, username);
            setSocket(newSocket);

            //
            newSocket.on("new-connection", (allUsers) => {
                if (allUsers.length == 0) {
                    newSocket.emit("note-init", note.noteid, note.title, note.text);
                } else {
                    newSocket.emit("get-latest-note", note.noteid);
                    showToast.info("You have connected to note successfully.");
                }

                const array = [];
                for (const user of allUsers) {
                    const userObj = {
                        text: user,
                        icon: "/profile.svg" //TODO: Get user profile image
                    };
                    array.push(userObj);
                }
                setConnectedUsers(array);
            });

            //Update current connected users when new user joins
            newSocket.on("add-connection", (user) => {
                setConnectedUsers((prevConnectedUsers) => {
                    const userObj = {
                        text: user,
                        icon: "/profile.svg"
                    }

                    return [...prevConnectedUsers, userObj];
                });
                console.log("New client joined, here's the username:", user);
                showToast.info(`${user} has joined.`)
            });

            newSocket.on("lost-connection", (lostUser) => {
                setConnectedUsers((allConnectedUsers) => {
                    return allConnectedUsers.filter(user => user.text !== lostUser);
                });
                console.log("Client left, here's the username:", lostUser);
                showToast.info(`${lostUser} has left.`)
            });

            newSocket.on("update-note", (title, noteBody) => {
                if (title) {
                    setNoteTitle(title);
                    functions.handleTitleUpdate(title);
                }
                if (noteBody) {
                    setMarkdown(noteBody);
                    functions.handleUpdate(noteBody);
                }
            });

            newSocket.on("update-title", (title) => {
                setNoteTitle(title);
                functions.handleTitleUpdate(noteTitle);
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, []);

    const handleTitleUpdate = (noteTitle) => {
        setNoteTitle(noteTitle);
        functions.handleTitleUpdate(noteTitle);

        if (useSocket) {
            socket.emit("title-update", note.noteid, noteTitle);
        }
    }

    const handleNoteUpdate = (noteText) => {
        setMarkdown(noteText);
        functions.handleUpdate(noteText);

        if (useSocket) {
            socket.emit("note-update", note.noteid, noteText);
        }
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
        const noteChanged = note.text !== markdown;
        if (noteChanged && connectedUsers.length == 0) {
            functions.handleSave();
        }
        functions.handleClose();
    }

    return (
        <div class="popup-bg">
            <div class="header">
                <div class="header-left">
                    <RoundIconButton 
                        icon="/x.svg" 
                        alt="close" 
                        plain={true}
                        onClick={handleNoteClose}/>
                    <input 
                        type="text" 
                        placeholder={"Note Title"} 
                        value={noteTitle}
                        onChange={e => handleTitleUpdate(e.target.value)}/>
                </div>
                <div class="header-right">
                    <TextButton text={previewBtn} onClick={showPreview}/>
                    <RoundIconButton 
                        icon="/options.svg" 
                        plain={true}
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
                        onChange={e => handleNoteUpdate(e.target.value)}
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
                usersPopupVisible &&
                (
                    <ClickAwayListener onClickAway={() => setUsersPopupVisible(false)}>
                        <div>
                            <IconMenuList options={connectedUsers}/>
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
    const token = localStorage.getItem(`authToken_${userId}`);
    const username = localStorage.getItem(`username_${userId}`);

    const [noteId, setNoteId] = useState(-1);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [popupVisible, setPopupVisible] = useState(false);

    const [searchPopupVisible, setSearchPopupVisible] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const searchOptions = {
        placeholder: "Search Note",
        buttonText: "Search",
        onClick: (string) => {
            handleSearch(string);
        }
    };


    const [notes, setNotes] = useState([]);
    const [noteIsNew, setNoteIsNew] = useState(false);

    useEffect(() => {
        updateNotes();
    }, [popupVisible]);

    const openNote = (note = null) => {
        if (note !== null) {
            setNoteTitle(note.title);
            setNoteBody(note.text);
            setNoteId(note.noteid);
            setNoteIsNew(false);

            setSelectedNote(note);
        } else {
            setNoteTitle("Note Title");
            setNoteBody("");
            setNoteId(-1);
            setNoteIsNew(true);

            setSelectedNote({
                noteid: -1,
                title: "Note Title",
                text: ""
            });
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
    }

    const handleShareNote = async (username) => {
        if (noteId < 0) {
            showToast.error("Save note before sharing");
            return;
        }
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

    const handleTitleUpdate = (noteTitle) => {
        setNoteTitle(noteTitle);
    }

    const handleSearch = (string) => {
        alert(`TODO: Search for ${string}`);
        setSearchHistory(prevHistory => [...prevHistory, string]);
    }

    const noteFunctions = {
        handleUpdate: handleNoteUpdate,
        handleTitleUpdate: handleTitleUpdate,
        handleClose: closeNote,
        handleDelete: deleteUserNote,
        handleShare: handleShareNote,
        handleSave: saveNote
    };

    const toolbarFunctions = {
        newNotePress: openNote,
        searchPress: () => setSearchPopupVisible(true)
    };

    return (
        <div class="background">
            <Toolbar username={username} toolFunctions={toolbarFunctions}/>

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
                    username={username}
                    note={selectedNote}
                    functions={noteFunctions}
                />)
            }
            {
                searchPopupVisible && 
                (
                    <ClickAwayListener onClickAway={() => setSearchPopupVisible(false)}>
                        <div>
                            <MenuListInput options={searchHistory} inputField={searchOptions} />
                        </div>
                    </ClickAwayListener>
                )
            }
        </div>
    );
}

export default NotesPage;