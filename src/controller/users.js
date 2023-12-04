import dbUsers from "../models/users.js";

export const getUsers = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized: Missing access token",
            });
        }

        const users = await dbUsers.findAll();

        res.json({
            error: false,
            users: users,
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
