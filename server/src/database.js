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

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);

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
        userid: userId
    });

    return newNote.noteid;
};

const deleteNote = (noteId) => {
    const note = Note.findByPk(noteId);

    if (!note) {
        return false;
    }

    note.destroy();
    return true;
};

const updateNote = async (noteId, noteTitle, noteText) => {
    const note = await Note.findByPk(noteId);

    if (!note) {
        return false;
    }
    await note.update({title: noteTitle, text: noteText});
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