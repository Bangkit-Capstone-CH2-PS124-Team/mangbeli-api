import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";
import {customAlphabet} from "nanoid";

// eslint-disable-next-line max-len
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

export const Register = async (req, res) => {
    try {
        const {name, email, password, confPassword} = req.body;

        if (!name || !email || !password || !confPassword) {
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

        const existingUser = await dbUsers.findOne({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: "Email is already registered",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: true,
                message: "Password must be at least 8 characters",
            });
        }

        if (password !== confPassword) {
            return res.status(400).json({
                error: true,
                message: "Password and Confirm Password do not match",
            });
        }

        const userId = nanoid();

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await dbUsers.create({
            userId,
            name,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            error: false,
            message: "User Created",
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
