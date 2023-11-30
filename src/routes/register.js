/* eslint-disable new-cap */
import express from "express";
import {Register} from "../controller/register.js";

const router = express.Router();

router.post("/", Register);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
