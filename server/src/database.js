require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const User = require('./models/user')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);

const addUser = (email, username, password) => {
    const newUser = User.create({
        email: email,
        name: username,
        password: password
    });

    return newUser;
};

const deleteUser = (userId) => {
    const user = User.findByPk(userId);

    if (!user) {
        return false;
    }

    user.destroy();
    return true;
};

const addNote = (userId, noteTitle, noteText) => {
    const newNote = Note.create({
        title: noteTitle,
        text: noteText,
        user_id: userId
    });

    return newNote.note_id;
};

const deleteNote = (noteId) => {
    const note = Note.findByPk(noteId);

    if (!note) {
        return false;
    }

    note.destroy();
    return true;
};

const updateNote = (noteId, noteData) => {
    const note = Note.findByPk(noteId);

    if (!note) {
        return false;
    }

    note.update(noteData);
    return true;
}

const sync = async () => {
    sequelize.sync();
}

module.exports = {
    addUser,
    deleteUser,
    addNote,
    deleteNote,
    updateNote,
    sync
};