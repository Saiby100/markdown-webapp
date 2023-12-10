module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        user_id: {
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
        }
    });

    return User;
};