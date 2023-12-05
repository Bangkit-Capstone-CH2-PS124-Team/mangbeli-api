import dbUsers from "../models/users.js";

export const getUser = async (req, res) => {
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
                userId,
            },
        });

        res.json({
            error: false,
            message: "User fetched successfully",
            dataUser: user,
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
