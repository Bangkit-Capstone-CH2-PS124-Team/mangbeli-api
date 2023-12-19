/* eslint-disable new-cap */
import express from "express";
import {fcmToken} from "../controller/fcmToken.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyToken, fcmToken);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
