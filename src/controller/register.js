import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
    const {name, email, password, confPassword} = req.body;
    try {
        const existingUser = await dbUsers.findOne({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered.",
            });
        }

        if (password !== confPassword) {
            return res.status(400).json({
                message: "Password dan Confirm Password tidak sama!",
            });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await dbUsers.create({
            name,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            message: "Register Success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};
