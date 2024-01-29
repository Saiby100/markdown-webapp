const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const PORT = process.env.PORT || 8008;

const notes = new Map();
const notesUsernames = new Map();
const socketUsername = new Map(); 
const latestNotes = new Map();
const latestNoteTitles = new Map();

io.on('connection', (socket) => {

  // When a user joins a room
  socket.on('join-note', (noteId, username) => {
    socket.join(noteId);
    console.log(`A user connected with socket ID: ${socket.id}, and username: ${username}`);

    // Create the room if it doesn't exist
    if (!notes.has(noteId)) {
      notes.set(noteId, { users: new Set() }); //Create a new room with an empty set of users
      notesUsernames.set(noteId, { users: new Set() });
    }

    socket.emit("new-connection", [...notesUsernames.get(noteId).users]);

    // Add the user to the room's user list
    notes.get(noteId).users.add(socket.id);
    notesUsernames.get(noteId).users.add(username);
    socketUsername.set(socket.id, username); //assign username with socket id

    socket.to(noteId).emit("add-connection", username);
  });

  socket.on("note-init", (noteId, noteTitle, noteText) => {
    console.log("Note was initialised");
    latestNoteTitles.set(noteId, noteTitle);
    latestNotes.set(noteId, noteText);
  });

  socket.on("get-latest-note", (noteId) => {
    console.log("latest note was fetched");
    socket.emit("update-note", latestNoteTitles.get(noteId), latestNotes.get(noteId));
  });

  // When a user updates a note
  socket.on("note-update", (noteId, noteText) => {
    latestNotes.set(noteId, noteText);

    socket.to(noteId).emit('update-note', null, noteText);
  });

  socket.on("title-update", (noteId, title) => {
    console.log("Title was updated");
    latestNoteTitles.set(noteId, title);

    socket.to(noteId).emit("update-note", title, null);
  });

  socket.on("leave-note", (noteId) => {
    for (const id of notes.keys()) {
        if (id == noteId) {
            notes.get(noteId).users.delete(socket.id);

            const username = socketUsername.get(socket.id);
            notesUsernames.get(noteId).users.delete(username);

            if (!notes.get(noteId).users.size) {
                latestNoteTitles.delete(noteId);
                latestNotes.delete(noteId);

            } else {
                socket.to(noteId).emit("lost-connection", username);

            }
            socket.to(noteId).emit('message', `${username} has left.`);
            console.log(`${username} has left note: ${noteId} just left`);
            break;
        }
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    for (const [noteId, note] of notes) {
      if (note.users.has(socket.id)) {
        note.users.delete(socket.id);
        
        const username = socketUsername.get(socket.id);
        notesUsernames.get(noteId).users.delete(username);

        if (!note.users.size) { // No users editing note, so delete note stored
            latestNoteTitles.delete(noteId);
            latestNotes.delete(noteId);
        } else {
            socket.to(noteId).emit("lost-connection", username);
        }

        socket.to(noteId).emit('message', `${username} has left.`);
        console.log(`${username} has left note: ${noteId} disconnected`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});