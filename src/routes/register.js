/* eslint-disable new-cap */
import express from "express";
import {Register} from "../controller/register.js";

const router = express.Router();

router.post("/", Register);

export default router;
