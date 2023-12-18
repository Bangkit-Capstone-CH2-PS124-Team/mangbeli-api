/* eslint-disable new-cap */
import express from "express";
import {getTracks} from "../controller/tracks.js";

const router = express.Router();

const Auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({
            error: true,
            message: "Missing access token",
        });
    }

    if (accessToken === "MangBeli-CH2-PS124") {
        next();
    } else {
        return res.status(403).json({
            error: true,
            message: "Invalid access token",
        });
    }
};

router.get("/", Auth, getTracks);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
