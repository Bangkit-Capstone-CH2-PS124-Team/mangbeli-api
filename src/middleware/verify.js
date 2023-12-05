import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({
            error: true,
            message: "Missing access token",
        });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: "Invalid access token",
            });
        }

        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = decoded.role;

        next();
    });
};
