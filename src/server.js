import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./config/database.js";
// import dbUsers from "./models/users.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import users from "./routes/users.js";
import token from "./routes/token.js";
import logout from "./routes/logout.js";
import location from "./routes/location.js";

const port = process.env.PORT;
const app = express();

try {
    await db.authenticate();
    console.log("[DATABASE] Connection has been established successfully");
    // await dbUsers.sync();
} catch (err) {
    console.log("[DATABASE] Failed to establish a connection to the database");
    console.error("[ERROR]", err);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: "*"}));

app.get("/", (req, res) => {
    res.json({
        error: false,
        message: "Success fetching the API",
    });
});

app.use("/register", register);
app.use("/login", login);
app.use("/users", users);
app.use("/token", token);
app.use("/logout", logout);
app.use("/location", location);

app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: "Not found",
    });
});

app.listen(port, ()=> {
    console.log(`[SERVER] Running on port ${port}`);
});
