import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "All fields are required",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                error: true,
                message: "Invalid email format",
            });
        }

        const user = await dbUsers.findAll({
            where: {
                email,
            },
        });

        if (!user || user.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Email is not registered",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: true,
                message: "Password must be at least 8 characters",
            });
        }

        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            return res.status(400).json({
                error: true,
                message: "Wrong Password",
            });
        }

        const userId = user[0].userId;
        const name = user[0].name;
        const role = user[0].role;
        const accessToken = jwt.sign({userId, email},
            process.env.ACCESS_TOKEN_SECRET, {
                // expiresIn: "60s",
                expiresIn: "1d",
            });
        const refreshToken = jwt.sign({userId, email},
            process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "1d",
            });

        await dbUsers.update({refresh_token: refreshToken}, {
            where: {
                userId,
            },
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1d
            secure: true,
        });

        res.json({
            error: false,
            message: "Login successful",
            loginResult: {
                userId,
                name,
                email,
                role,
                accessToken,
            },
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
