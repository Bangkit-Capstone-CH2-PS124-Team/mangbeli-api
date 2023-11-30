/* eslint-disable new-cap */
import express from "express";
import {Login} from "../controller/login.js";

const router = express.Router();

router.post("/", Login);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
