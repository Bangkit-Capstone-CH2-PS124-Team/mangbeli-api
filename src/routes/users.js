/* eslint-disable new-cap */
import express from "express";
import {getUsersMaps} from "../controller/users.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.get("/maps", verifyToken, getUsersMaps);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
