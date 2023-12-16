/* eslint-disable new-cap */
import express from "express";
import {getVendors, getVendorsMaps} from "../controller/vendors.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.get("/", verifyToken, getVendors);
router.get("/maps", verifyToken, getVendorsMaps);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
