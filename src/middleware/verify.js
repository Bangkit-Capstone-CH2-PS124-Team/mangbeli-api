import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            error: true,
            message: "Unauthorized: Missing refresh token",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: "Forbidden: Invalid refresh token",
            });
        }

        req.email = decoded.email;

        next();
    });
};
