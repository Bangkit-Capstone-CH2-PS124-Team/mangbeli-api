/* eslint-disable new-cap */
import {Sequelize} from "sequelize";
import db from "../config/database.js";
import dbUsers from "./users.js";
import dbVendors from "./vendors.js";

const {DataTypes} = Sequelize;

const dbTracks = db.define(
    "tracks", {
        trackId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        vendorId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: dbVendors,
                key: "vendorId",
            },
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: dbUsers,
                key: "userId",
            },
        },
        latitude: {
            type: DataTypes.DOUBLE,
        },
        longitude: {
            type: DataTypes.DOUBLE,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    },
);

export default dbTracks;
