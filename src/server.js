import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./config/database.js";
// import dbUsers from "./models/users.js";
import users from "./routes/users.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import token from "./routes/token.js";
import logout from "./routes/logout.js";
const port = process.env.PORT;
const app = express();

try {
    await db.authenticate();
    console.log("[DATABASE] Connection has been established successfully");
    // await dbUsers.sync();
} catch (error) {
    console.log("[DATABASE] Unable to connect to the database:");
    console.error(error);
}

app.use(cors({credentials: true, origin: "*"}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({
        error: false,
        message: "Success fetching the API",
    });
});

app.use("/users", users);
app.use("/register", register);
app.use("/login", login);
app.use("/token", token);
app.use("/logout", logout);

const server = app.listen(port, () => {
    const address = server.address().address;
    console.log(`[SERVER] is running on http://${address}:${port}`);
});
