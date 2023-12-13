module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
            
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(32),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    User.associate = (models) => {
        User.hasMany(models.Note, {foreignKey: 'userid'});
    }

    return User;
};