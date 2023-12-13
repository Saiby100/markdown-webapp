require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());
const port = 3000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});
const User = require('./models/user')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);

app.get('/', async (req, res) => {
    res.json({message: 'Api is active'});
});

app.post('/add-user', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const newUser = await User.create({
            email: email,
            name: name,
            password: password
        });

        res.status(201).json({userId: newUser.userid, message: 'Successfully added user'});
    } catch (err)  {
        if (err instanceof Sequelize.UniqueConstraintError) {
            errorMessage = err.errors[0]['message'];
            res.status(409).json({error: errorMessage});

        } else {
            console.log(err)
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
});

app.delete('/delete-user/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (!user) {
            res.status(404).json({error: 'User not found'});
        } else {
            res.status(201).json({message: 'User deleted Successfully'})
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/add-note/:userId', async (req, res) => {
    try {
        const newNote = await Note.create({
            title: title,
            text: text,
            userid: req.params.userId
        });

        res.status(201).json({noteId: newNote.noteId, message: 'Note added successfully'});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.delete('/delete-note/:noteId', async (req, res) => {
    try {
        const note = Note.findByPk(req.params.noteId);
        if (!note) {
            res.status(404).json({error: 'Note not found'});
        } else {
            await note.destroy();
            res.status(201).json({message: 'Note deleted successfully'});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

app.put('/update-note/:noteId', async (req, res) => {
    try {
        const {title, text} = req.body;
        const note = await Note.findByPk(req.params.noteId);

        if (!note) {
            res.status(404).json({error: 'Note not found'});
        } else {
            await note.update({title: title, text: text});
            res.status(201).json({message: 'Note updated successfully'});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
