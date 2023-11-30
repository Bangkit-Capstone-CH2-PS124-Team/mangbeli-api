/* eslint-disable new-cap */
import express from "express";
import {Logout} from "../controller/logout.js";

const router = express.Router();

router.delete("/", Logout);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
