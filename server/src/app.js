require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const User = require('./models/user')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);

app.get('/', async (req, res) => {
  try {
    const usersWithNotes = await User.findAll({
      include: Note,
    });

    res.json(usersWithNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
