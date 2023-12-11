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

app.get('/', async (req, res) => {
    res.json({message: 'Api is active'});
});

app.post('/add-user', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        });

        res.status(201).json({user_id: newUser.user_id, message: 'Successfully added user'});
    } catch (err)  {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.delete('/delete-user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({error: 'User not found'});
        }

        await user.destroy();

        res.status(201).json({message: 'User deleted Successfully'})

    } catch (err) {
    }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
