/* eslint-disable new-cap */
import express from "express";
import {refreshToken} from "../controller/refreshToken.js";

const router = express.Router();

router.get("/", refreshToken);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
