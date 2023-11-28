import "dotenv/config";
import express from "express";
import db from "./config/database.js";
// import dbUsers from "./models/users.js";
import users from "./routes/users.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
const port = process.env.PORT;
const app = express();

app.use(express.json());

try {
    await db.authenticate();
    console.log("[DATABASE] Connection has been established successfully.");
    // await dbUsers.sync();
} catch (error) {
    console.error(error);
}

app.use("/users", users);
app.use("/register", register);
app.use("/login", login);

app.listen(port, ()=> {
    console.log(`[SERVER] is running on http://localhost:${port}`);
});
