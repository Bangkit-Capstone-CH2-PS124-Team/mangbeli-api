import dbUsers from "../models/users.js";

export const fcmToken = async (req, res) => {
    try {
        const userId = req.userId;
        const fcm = req.body;

        if (!fcm) {
            return res.status(400).json({
                error: true,
                message: "FCM token are required",
            });
        }

        await dbUsers.update(
            fcm,
            {
                where: {
                    userId,
                },
            },
        );

        res.json({
            error: false,
            message: "FCM token updated successfully",
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
