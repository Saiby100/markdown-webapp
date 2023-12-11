module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define("Note", {
        note_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        text: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    });

    Note.associate = (models) => {
        Note.belongsTo(models.User, {foreignKey: 'user_id'});
    }

    return Note;
};