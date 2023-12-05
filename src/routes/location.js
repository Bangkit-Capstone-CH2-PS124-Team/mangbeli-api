/* eslint-disable new-cap */
import express from "express";
import {patchLoc, getLoc} from "../controller/location.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.patch("/", verifyToken, patchLoc);
router.get("/", verifyToken, getLoc);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
