import dbUsers from "../models/users.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const user = await dbUsers.findAll({
            where: {
                refresh_token: refreshToken,
            },
        });

        if (!user[0]) {
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.sendStatus(403);
                }
                const userId = user[0].id;
                const name = user[0].name;
                const email = user[0].email;
                const accessToken = jwt.sign({userId, name, email},
                    process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: "60s",
                    });
                res.json({
                    error: false,
                    accessToken,
                });
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
