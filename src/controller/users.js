import dbUsers from "../models/users.js";

export const getUsers = async (req, res) => {
    try {
        const users = await dbUsers.findAll();
        res.status(200).json({
            users: users,
        });
    } catch (error) {
        console.log(error);
    }
};
