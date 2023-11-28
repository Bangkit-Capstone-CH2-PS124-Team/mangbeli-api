/* eslint-disable new-cap */
import express from "express";
import {getUsers} from "../controller/users.js";
import {verifyToken} from "../middleware/verify.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);

export default router;
