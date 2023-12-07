/* eslint-disable new-cap */
import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const dbUsers = db.define(
    "users", {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
        refresh_token: {
            type: DataTypes.TEXT,
        },
        image_url: {
            type: DataTypes.STRING,
        },
        no_hp: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM("user", "vendor"),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
        },
        longitude: {
            type: DataTypes.DOUBLE,
        },
        favorite: {
            type: DataTypes.JSON,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    },
);

export default dbUsers;
