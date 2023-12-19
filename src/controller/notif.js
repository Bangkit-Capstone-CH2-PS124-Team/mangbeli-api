/* eslint-disable max-len */
import dbUsers from "../models/users.js";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccountRaw = fs.readFileSync("./credentials-firebase.json", "utf8");
const serviceAccount = JSON.parse(serviceAccountRaw);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const Notification = async (req, res) => {
    try {
        const {to, title, body} = req.body;

        if (!to || !title || !body) {
            return res.status(400).json({
                error: true,
                message: "All fields are required",
            });
        }

        const user = await dbUsers.findOne({
            where: {
                userId: to,
            },
            attributes: ["fcm"],
        });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        const fcm = user.fcm;
        if (!fcm || fcm === "") {
            return res.status(404).json({
                error: true,
                message: "FCM token not found for the user",
            });
        }

        const message = {
            token: fcm,
            notification: {
                title,
                body,
            },
            android: {
                priority: "HIGH",
            },
            apns: {
                headers: {
                    "apns-priority": "10",
                },
            },
        };

        admin.messaging().send(message)
            .then((response) => {
                res.json({
                    error: false,
                    message: "Notification sent successfully",
                });
            })
            .catch((err) => {
                console.error("[ERROR] sending message:", err);
                return res.status(500).json({
                    error: true,
                    message: "Error sending message",
                    errorMessage: err.message,
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

