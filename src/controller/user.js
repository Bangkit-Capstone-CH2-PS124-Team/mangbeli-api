/* eslint-disable max-len */
/* eslint-disable camelcase */
import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";
import bcrypt from "bcrypt";
import {Storage} from "@google-cloud/storage";
import path from "path";
import mime from "mime-types";
import {customAlphabet} from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

const storage = new Storage({keyFilename: "credentials-bucket.json"});
const bucket = storage.bucket(process.env.BUCKET_NAME);

export const myProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: {exclude: ["password", "refreshToken"]},
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
        const {name, oldPassword, newPassword, noHp, favorite, role} = req.body;

        const user = await dbUsers.findOne({
            where: {
                userId,
            },
        });

        if (name) {
            await dbUsers.update({name}, {where: {userId}});
        }

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

            await dbUsers.update({password: hashPassword}, {where: {userId}});
        }

        if (noHp) {
            await dbUsers.update({noHp}, {where: {userId}});
        }

        if (favorite) {
            await dbUsers.update({favorite}, {where: {userId}});
        }

        if (role) {
            if (role !== "user" && role !== "vendor") {
                return res.status(400).json({
                    error: true,
                    message: "Invalid role",
                });
            }

            await dbUsers.update({role}, {where: {userId}});

            if (role === "vendor") {
                await dbVendors.create({
                    vendorId: nanoid(),
                    userId: userId,
                });
            }
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

            const oldFile = await dbUsers.findOne({where: {userId}, attributes: ["imageUrl"]});

            if (oldFile && oldFile.imageUrl) {
                const urlParts = oldFile.imageUrl.split("/");
                const oldFileName = urlParts[urlParts.length - 1];
                const oldFileBlob = bucket.file(oldFileName);

                await oldFileBlob.delete();
            }

            await dbUsers.update({imageUrl: req.file.cloudStoragePublicUrl}, {where: {userId}});

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
            attributes: {exclude: ["password", "refreshToken"]},
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
