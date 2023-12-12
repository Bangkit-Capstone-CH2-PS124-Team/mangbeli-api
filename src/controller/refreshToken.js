import dbUsers from "../models/users.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: true,
                message: "Missing refresh token",
            });
        }

        const user = await dbUsers.findAll({
            where: {
                refreshToken,
            },
        });

        if (!user[0]) {
            return res.status(403).json({
                error: true,
                message: "Invalid refresh token",
            });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        error: true,
                        message: "Invalid refresh token",
                    });
                }

                const userId = user[0].userId;
                const email = user[0].email;
                const accessToken = jwt.sign({userId, email},
                    process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: "30d",
                    });

                res.json({
                    error: false,
                    accessToken,
                });
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
