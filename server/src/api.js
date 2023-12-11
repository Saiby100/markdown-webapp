const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
app.use(express.json());
const port = 3000;

const db = require('./database');


app.get('/', async (req, res) => {
    res.json({message: 'Api is active'});
});

app.post('/add-user', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const newUser = await db.addUser(email, name, password);

        res.status(201).json({user_id: newUser.user_id, message: 'Successfully added user'});
    } catch (err)  {
        if (err instanceof Sequelize.UniqueConstraintError) {
            errorMessage = err.errors[0]['message'];
            res.status(409).json({error: errorMessage});

        } else {
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
});

app.delete('/delete-user/:userId', async (req, res) => {
    try {
        const userDeleted = db.deleteUser(req.params.userId);

        if (!userDeleted) {
            res.status(404).json({error: 'User not found'});
        }

        res.status(201).json({message: 'User deleted Successfully'})

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/add-note/:userId', async (req, res) => {
    try {
        const {title, text} = req.body;
        await db.addNote(req.params.userId, title, text);

        res.status(201).json({message: 'Note added successfully'});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.delete('/delete-note/:noteId', async (req, res) => {
    try {
        const noteDeleted = db.deleteNote(req.params.noteId);
        if (!noteDeleted) {
            res.status(404).json({error: 'Note not found'});
        }

        res.status(201).json({message: 'Note deleted successfully'});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

app.put('/update-note/:noteId', async (req, res) => {
    try {
        const noteData = req.body;
        console.log(noteData);
        // const noteFound = db.updateNote(req.params.noteId)

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
