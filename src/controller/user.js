/* eslint-disable camelcase */
import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";

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

export const patchUser = async (req, res) => {
    try {
        const userId = req.userId;
        const {name, oldPassword, newPassword, no_hp, favorite} = req.body;

        const user = await dbUsers.findOne({
            where: {
                userId,
            },
        });

        if (oldPassword) {
            if (!newPassword) {
                return res.status(400).json({
                    error: true,
                    message: "newPassword must also be provided",
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    error: true,
                    message: "New Password must be at least 8 characters",
                });
            }

            const match = await bcrypt.compare(oldPassword, user.password);

            if (!match) {
                return res.status(400).json({
                    error: true,
                    message: "Password and oldPassword do not match",
                });
            }

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(newPassword, salt);

            await dbUsers.update(
                {
                    name,
                    password: hashPassword,
                    no_hp,
                    favorite,
                },
                {
                    where: {
                        userId,
                    },
                },
            );
        } else {
            await dbUsers.update(
                {
                    name,
                    no_hp,
                    favorite,
                },
                {
                    where: {
                        userId,
                    },
                },
            );
        }

        res.json({
            error: false,
            message: "User updated successfully",
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
