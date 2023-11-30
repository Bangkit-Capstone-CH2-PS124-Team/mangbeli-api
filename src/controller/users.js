import dbUsers from "../models/users.js";

export const getUsers = async (req, res) => {
    try {
        const users = await dbUsers.findAll();
        res.status(200).json({
            users: users,
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
