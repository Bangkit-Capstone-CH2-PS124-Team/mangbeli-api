import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./config/database.js";
// import dbUsers from "./models/users.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import user from "./routes/user.js";
import vendor from "./routes/vendor.js";
import vendors from "./routes/vendors.js";
import location from "./routes/location.js";
import token from "./routes/token.js";
import logout from "./routes/logout.js";
import tracks from "./routes/tracks.js";

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
app.use("/user", user);
app.use("/vendor", vendor);
app.use("/vendors", vendors);
app.use("/location", location);
app.use("/token", token);
app.use("/logout", logout);
app.use("/tracks", tracks);

app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: "Endpoint Not found",
    });
});

app.listen(port, ()=> {
    console.log(`[SERVER] Running on port ${port}`);
});
