module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
        noteid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: false
    });

    Note.associate = (models) => {
        Note.belongsTo(models.User, {
            foreignKey: 'userid',
            onDelete: 'CASCADE',
            references: {
                model: 'Users',
                key: 'userid'
            }
        });

        Note.hasMany(models.SharedNote, {foreignKey: 'noteid'});
    }

    return Note;
};
