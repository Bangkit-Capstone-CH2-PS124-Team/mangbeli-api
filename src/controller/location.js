import dbUsers from "../models/users.js";

export const patchLoc = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        const {latitude, longitude} = req.body;

        if (!accessToken) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized: Missing access token",
            });
        }

        if (!latitude || !longitude) {
            return res.status(400).json({
                error: true,
                message: "All fields are required",
            });
        }

        const userId = req.userId;

        await dbUsers.update(
            {latitude, longitude},
            {
                where: {
                    userId,
                },
            },
        );

        res.json({
            error: false,
            message: "Location updated successfully",
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

export const getLoc = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        const userId = req.query.userId;

        if (!accessToken) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized: Missing access token",
            });
        }

        if (!userId) {
            return res.status(401).json({
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
