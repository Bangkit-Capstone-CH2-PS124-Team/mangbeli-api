/* eslint-disable new-cap */
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
    role: {
        type: DataTypes.ENUM("user", "vendor"),
    },
    // no_hp: {
    //     type: DataTypes.STRING,
    // },
    // img_profile: {
    //     type: DataTypes.STRING,
    // },
    // favorite: {
    //     type: DataTypes.JSON,
    // },
    // latitude: {
    //     type: DataTypes.STRING,
    // },
    // longitude: {
    //     type: DataTypes.STRING,
    // },
}, {
    freezeTableName: true,
});

export default dbUsers;
