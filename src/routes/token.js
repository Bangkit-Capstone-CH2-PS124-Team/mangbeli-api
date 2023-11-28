/* eslint-disable new-cap */
import express from "express";
import {refreshToken} from "../controller/refreshToken.js";

const router = express.Router();

router.get("/", refreshToken);

export default router;
