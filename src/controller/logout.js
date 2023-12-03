import dbUsers from "../models/users.js";

export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(204);
        }

        const user = await dbUsers.findAll({
            where: {
                refresh_token: refreshToken,
            },
        });

        if (!user[0]) {
            return res.sendStatus(204);
        }

        const userId = user[0].id;
        await dbUsers.update({refresh_token: null}, {
            where: {
                id: userId,
            },
        });

        res.clearCookie("refreshToken");

        res.json({
            error: false,
            message: "Logout successful",
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
