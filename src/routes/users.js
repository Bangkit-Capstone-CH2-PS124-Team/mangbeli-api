/* eslint-disable new-cap */
import express from "express";
import {getUsers} from "../controller/users.js";

const router = express.Router();

router.get("/", getUsers);

export default router;
