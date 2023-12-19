/* eslint-disable new-cap */
import express from "express";
import {Notification} from "../controller/notif.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.post("/", verifyToken, Notification);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
