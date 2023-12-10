import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";
import dbTracks from "../models/tracks.js";
import {customAlphabet} from "nanoid";

// eslint-disable-next-line max-len
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

export const patchLoc = async (req, res) => {
    try {
        const userId = req.userId;
        const {latitude, longitude} = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                error: true,
                message: "All fields are required",
            });
        }

        await dbUsers.update(
            {latitude, longitude},
            {
                where: {
                    userId,
                },
            },
        );

        const role = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: ["role"],
        }).then((user) => user?.role);

        if (role === "vendor") {
            const vendor = await dbVendors.findOne({
                where: {
                    userId: userId,
                },
                attributes: ["vendorId"],
            });

            await dbTracks.create({
                trackId: nanoid(),
                vendorId: vendor.vendorId,
                userId,
                latitude,
                longitude,
            });
        }

        res.json({
            error: false,
            message: "Location updated successfully",
        });
    } catch (err) {
        // console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};

export const getLoc = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                error: true,
                message: "Parameter userId required",
            });
        }

        const user = await dbUsers.findOne({
            where: {
                userId: userId,
            },
            attributes: ["latitude", "longitude"],
        });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        const {latitude, longitude} = user;

        res.json({
            error: false,
            message: "Location fetched successfully",
            latitude,
            longitude,
        });
    } catch (err) {
        // console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};

export const deleteLoc = async (req, res) => {
    try {
        const userId = req.userId;

        await dbUsers.update(
            {latitude: null, longitude: null},
            {
                where: {
                    userId,
                },
            },
        );

        res.json({
            error: false,
            message: "Location deleted successfully",
        });
    } catch (err) {
        // console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
