module.exports = (sequelize, DataTypes) => {
    const SharedNote = sequelize.define('SharedNote', {
        sharedid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        noteid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    SharedNote.associate = (models) => {
        SharedNote.belongsTo(models.User, {
            foreignKey: 'userid',
            onDelete: 'CASCADE',
            references: {
                model: 'Users',
                key: 'userid'    
            }
        });

        SharedNote.belongsTo(models.Note, {
            foreignKey: 'noteid',
            onDelete: 'CASCADE',
            references: {
                model: 'Notes',
                key: 'noteid'
            }
        });
    };

    return SharedNote;
};