/* eslint-disable new-cap */
import express from "express";
import {getUser} from "../controller/user.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.get("/", verifyToken, getUser);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
