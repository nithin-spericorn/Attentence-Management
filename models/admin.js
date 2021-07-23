
module.exports = (sequelize, DataTypes) => {
    const user= sequelize.define('user', {
        user_id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        role_id: {
            type: DataTypes.INTEGER,
            default:0,
            //allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile:{
            type: DataTypes.STRING,
            allowNull:false
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        experience: {
            type: DataTypes.INTEGER,
            default:0
        },
        leaveStatus:{
            type: DataTypes.STRING,
           // default:"Leave",
            allowNull:true
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        action:{
            type: DataTypes.INTEGER,
            allowNull:true
        }

       
    },{
        timestamps: true,
       // underscored: true
    })
    user.associate = function (models) {
        user.hasMany(models.leave, { foreignKey: 'user_id' })
    };

    return user;
};
