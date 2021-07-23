'use strict';
const Sequelize=require("sequelize")
module.exports = (sequelize, DataTypes) => {
    const leave= sequelize.define('leave', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
       /* user: {
            type: DataTypes.INTEGER,
            allowNull:false
        },*/
        leaveStatus:{
            type: DataTypes.STRING,
           // default:"Leave",
            allowNull:false
        },
        date:{
            type: DataTypes.STRING,
           // default:"Leave",
            allowNull:false
        },
        
      work_duration:{
          type:DataTypes.TIME,
          default:0
      }
       
    })
    leave.associate = function (models) {
        
        leave.belongsTo(models.user, { foreignKey: 'user_id' })
             
    };

    return leave;
};
