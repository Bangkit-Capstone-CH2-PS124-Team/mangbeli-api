import dbUsers from "../models/users.js";

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }
    const user = await dbUsers.findAll({
        where: {
            refresh_token: refreshToken,
        },
    });
    if (!user[0]) {
        return res.sendStatus(204);
    }
    const userId = user[0].id;
    await dbUsers.update({refresh_token: null}, {
        where: {
            id: userId,
        },
    });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
};
