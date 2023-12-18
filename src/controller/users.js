/* eslint-disable max-len */
import dbUsers from "../models/users.js";
import {calculateDistance} from "../utils/distance.js";

export const getUsersMaps = async (req, res) => {
    try {
        const userId = req.userId;

        const vendor = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: ["role", "latitude", "longitude"],
        });

        if (vendor.role !== "vendor") {
            return res.status(403).json({
                error: true,
                message: "Invalid role",
            });
        }

        if (!vendor.latitude || !vendor.longitude) {
            return res.status(400).json({
                error: true,
                message: "Vendor coordinates not found. Please turn on your location",
            });
        }

        const users = await dbUsers.findAll({
            where: {
                role: "user",
            },
            attributes: {exclude: ["email", "password", "refreshToken", "role"]},
        });

        const formattedUsers = users.map((user) => {
            const distance = calculateDistance(
                vendor.latitude,
                vendor.longitude,
                user.latitude,
                user.longitude,
            );
            return {
                userId: user.userId,
                name: user.name,
                imageUrl: user.imageUrl,
                noHp: user.noHp,
                favorite: user.favorite,
                latitude: user.latitude,
                longitude: user.longitude,
                distance: distance,
            };
        });

        res.json({
            error: false,
            message: "Maps users fetched successfully",
            listUsers: formattedUsers,
        });
    } catch (err) {
        console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
