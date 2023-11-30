module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define("Note", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: DataTypes.TEXT

    });

    Note.associate = (models) => {
        Note.belongsTo(models.User);
    };

    return Note;
};