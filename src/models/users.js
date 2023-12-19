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
        refreshToken: {
            type: DataTypes.TEXT,
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
        noHp: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM("user", "vendor"),
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
        fcm: {
            type: DataTypes.TEXT,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    },
);

export default dbUsers;
