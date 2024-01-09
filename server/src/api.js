require('dotenv').config();

const crypto = require('crypto');

const functions = require('./utils/functions');

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const cors = require("cors");

const app = express();
app.use(cors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());
const port = 8000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});
const User = require('./models/user')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);
const SharedNote = require('./models/sharednote')(sequelize, DataTypes);

//Initialize model associations
(function() {
    Object.values(sequelize.models)
        .filter(model => typeof model.associate === 'function')
        .forEach(model => model.associate(sequelize.models));

})();

app.get('/', async (req, res) => {
    res.status(201).json({message: 'Api is active'});
});

app.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const salt = crypto.randomBytes(16).toString('hex');
        const hashed_password = await functions.hash(password, salt);

        const newUser = await User.create({
            email: email,
            name: name,
            password: hashed_password,
            salt: salt
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

app.post('/login', async (req, res) => {
    try {
        const {name, password} = req.body;
        const user = await User.findOne({
            where: {name: name}
        });

        if (!user) {
            res.status(404).json({error: 'User not found'});
        } else {
            const salt = user.salt;
            const hashed_password = await functions.hash(password, salt);

            if (hashed_password === user.password) {
                res.status(201).json({
                    message: 'User login successful',
                    token: functions.generateAccessToken(name),
                    userId: user.userid
                });
            } else {
                res.status(401).json({error: 'Username and password do not match'})
            }
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.delete('/delete-user/:userId', functions.authenticateToken, async (req, res) => {
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

app.post('/add-note/:userId', functions.authenticateToken, async (req, res) => {
    try {
        const {title, text} = req.body;
        const newNote = await Note.create({
            title: title,
            text: text,
            userid: req.params.userId
        });

        res.status(201).json({noteId: newNote.noteid, message: 'Note added successfully'});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.delete('/delete-note/:noteId/:userId', functions.authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.params.userId;

        const sharedNote = await SharedNote.findOne({
            where: {
                noteid: noteId,
                userid: userId
            }
        });

        if (!sharedNote) {
            const note = await Note.findByPk(noteId);
            if (!note) {
                res.status(404).json({error: 'Note not found'});
            } else {
                await note.destroy();
                res.status(201).json({message: 'Note deleted successfully'});
            }
        } else {
            await sharedNote.destroy();
            res.status(201).json({message: 'Note deleted successfully'});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/get-notes/:userId', functions.authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [Note, SharedNote]
        });

        if (user) {
            const notes = user.Notes.map((note) => note.dataValues);
            const sharedNotes = await Promise.all (user.SharedNotes.map(async (sharedNote) => {
                const note = await sharedNote.getNote();
                return note? note.dataValues : null;
                })
            );

            res.status(201).json(notes.concat(sharedNotes));
        } else {
            res.status(404).json({error: 'User not found'});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.put('/update-note/:noteId', functions.authenticateToken, async (req, res) => {
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

app.post('/share-note', functions.authenticateToken, async (req, res) => {
    try {
        const {fromUserId, toUsername, noteId} = req.body
        const toUser = await User.findOne({
            where: {name: toUsername}
        });

        if (!toUser) {
            res.status(404).json({error: 'User not found'})

        } else {
            if (fromUserId !== toUser.userid) {
                await SharedNote.create({
                    noteid: noteId,
                    userid: toUser.userid
                });
            } 
            res.status(201).json({message: 'Note shared successfully'});
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'});
    }

});

app.delete('/delete-username/:username', async (req, res) => {
    try {
        const {token} = req.body;

        if (token !== process.env.SECRET_TOKEN) {
            res.sendStatus(403);
        } 
        else {
            const username = req.params.username;
            const user = await User.findOne({
                where: {name: username}
            });

            if (!user) {
                res.status(404).json({error: 'User not found'});
            } else {
                await user.destroy();
                res.status(201).json({message: 'Deleted user.'})
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Internal Server Error'});
    }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
