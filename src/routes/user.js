/* eslint-disable max-len */
/* eslint-disable new-cap */
import express from "express";
import multer from "multer";
import {myProfile, getUser, patchProfile, uploadImage} from "../controller/user.js";
import {verifyToken} from "../middleware/verify.js";

const upload = multer();
const router = express.Router();

router.get("/profile", verifyToken, myProfile);
router.patch("/profile", verifyToken, patchProfile);
router.post("/profile/upload", upload.single("image"), verifyToken, uploadImage);
router.get("/", verifyToken, getUser);
router.all("/", (req, res) => {
    res.status(405).json({
        error: true,
        message: "Method not allowed",
    });
});

export default router;
