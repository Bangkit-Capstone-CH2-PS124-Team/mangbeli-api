/* eslint-disable new-cap */
import {Sequelize} from "sequelize";
import db from "../config/database.js";
import dbUsers from "./users.js";

const {DataTypes} = Sequelize;

const dbVendors = db.define(
    "vendors", {
        vendorId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: dbUsers,
                key: "userId",
            },
        },
        nameVendor: {
            type: DataTypes.STRING,
        },
        products: {
            type: DataTypes.JSON,
        },
        minPrice: {
            type: DataTypes.INTEGER,
        },
        maxPrice: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    },
);

dbVendors.belongsTo(dbUsers, {foreignKey: "userId"});

export default dbVendors;
