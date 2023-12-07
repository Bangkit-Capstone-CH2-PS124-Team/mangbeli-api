/* eslint-disable new-cap */
import express from "express";
import {getTracks} from "../controller/tracks.js";

const router = express.Router();

router.get("/", getTracks);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
