/* eslint-disable new-cap */
import express from "express";
import {Logout} from "../controller/logout.js";

const router = express.Router();

router.delete("/", Logout);

export default router;
