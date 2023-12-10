require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const User = require('./models/user')(sequelize, DataTypes);
// const Note = require('./models/note')(sequelize, DataTypes);

app.get('/', async (req, res) => {
    res.json({message: "Api is active"});
});

// app.post('/add-user', async (req, res) => {
//     try {
//         // const {name, email, password} = req.body;
//         console.log(req.body);
//         // const newUser = await User.create({
//         //     name: name,
//         //     email: email,
//         //     password: password
//         // });

//         // console.log("User Added");
//         res.status(201);
//     }
//     catch (err)  {
//         console.log(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
