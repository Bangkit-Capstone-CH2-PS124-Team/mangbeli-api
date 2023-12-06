/* eslint-disable new-cap */
import express from "express";
import multer from "multer";
import {getUser, patchUser, uploadImage} from "../controller/user.js";
import {verifyToken} from "../middleware/verify.js";

const upload = multer();
const router = express.Router();

router.get("/", verifyToken, getUser);
router.patch("/", verifyToken, patchUser);
router.patch("/upload", upload.single("image"), verifyToken, uploadImage);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
