import dbUsers from "../models/users.js";

export const getUsers = async (req, res) => {
    try {
        const Users = await dbUsers.findAll();
        res.status(200).json({
            users: Users,
        });
    } catch (error) {
        console.log(error);
    }
};
