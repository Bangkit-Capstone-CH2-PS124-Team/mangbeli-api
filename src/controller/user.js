/* eslint-disable camelcase */
import dbUsers from "../models/users.js";
import bcrypt from "bcrypt";
import {Storage} from "@google-cloud/storage";
import path from "path";
import mime from "mime-types";

const storage = new Storage({keyFilename: "credentials.json"});
const bucket = storage.bucket(process.env.BUCKET_NAME);

export const myProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: {exclude: ["password", "refresh_token"]},
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

export const patchProfile = async (req, res) => {
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

export const uploadImage = async (req, res) => {
    try {
        const userId = req.userId;

        if (!req.file) {
            return res.status(400).json({
                error: true,
                message: "File image are required",
            });
        }

        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            return res.status(400).json({
                error: true,
                message: "File extension not allowed",
            });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png"];
        const mimeType = mime.lookup(req.file.originalname);

        if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
            return res.status(400).json({
                error: true,
                message: "File type not allowed",
            });
        }

        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                error: true,
                message: "File size exceeds the maximum allowed size (5 MB)",
            });
        }

        const timestamp = new Date().getTime();
        const fileName = `${userId}-${timestamp}.jpg`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: `image/${fileExt.slice(1)}`,
            },
        });

        blobStream.on("error", (err) => {
            // console.error("[ERROR] uploading file:", err);
            return res.status(500).json({
                error: true,
                message: "Error uploading image",
                errorMessage: err.message,
            });
        });

        blobStream.on("finish", async () => {
            req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;

            await dbUsers.update(
                {
                    image_url: req.file.cloudStoragePublicUrl,
                },
                {
                    where: {
                        userId,
                    },
                },
            ),

            res.json({
                error: false,
                message: "Image uploaded successfully",
                imageUrl: req.file.cloudStoragePublicUrl,
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        // console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};

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
            attributes: {exclude: ["password", "refresh_token"]},
        });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

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
