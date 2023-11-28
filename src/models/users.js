import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const dbUsers = db.define("users", {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    refresh_token: {
        type: DataTypes.TEXT,
    },
    // no_hp: {
    //     type: DataTypes.STRING,
    // },
    // latitude: {
    //     type: DataTypes.STRING,
    // },
    // longitude: {
    //     type: DataTypes.STRING,
    // },
    // img_profile: {
    //     type: DataTypes.STRING,
    // },
    // role: {
    //     type: DataTypes.STRING,
    // },
}, {
    freezzTableName: true,
});

export default dbUsers;
