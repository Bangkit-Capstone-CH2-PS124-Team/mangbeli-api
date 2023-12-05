/* eslint-disable new-cap */
import express from "express";
import {getVendor} from "../controller/vendor.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.get("/", verifyToken, getVendor);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
