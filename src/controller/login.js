import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
    try {
        const user = await dbUsers.findAll({
            where: {
                email: req.body.email,
            },
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            return res.status(400).json({
                message: "Wrong Password!",
            });
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email},
            process.env.ACCESSS_TOKEN_SECRET, {
                expiresIn: "60s",
            });
        const refreshToken = jwt.sign({userId, name, email},
            process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "1d",
            });
        await dbUsers.update({refresh_token: refreshToken}, {
            where: {
                id: userId,
            },
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1d
            secure: true,
        });
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({
            message: "Email is not registered yet!",
        });
    }
};
