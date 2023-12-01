import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
    const {name, email, password, confPassword, role} = req.body;
    try {
        if (!name || !email || !password || !confPassword || !role) {
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

        if (password.length < 8) {
            return res.status(400).json({
                error: true,
                message: "Password must be at least 8 characters",
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

        if (password !== confPassword) {
            return res.status(400).json({
                error: true,
                message: "Password and Confirm Password do not match",
            });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await dbUsers.create({
            name,
            email,
            password: hashPassword,
            role,
        });

        res.status(201).json({
            error: false,
            message: "User Created",
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
