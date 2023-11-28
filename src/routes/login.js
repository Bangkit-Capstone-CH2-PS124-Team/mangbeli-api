/* eslint-disable new-cap */
import express from "express";
import {Login} from "../controller/login.js";

const router = express.Router();

router.post("/", Login);

export default router;
