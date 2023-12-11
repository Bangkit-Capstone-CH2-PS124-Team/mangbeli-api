export const checkContentType = (req, res, next) => {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("multipart/form-data")) {
        return res.status(415).json({
            error: true,
            message: "Unsupported Media Type",
        });
    }

    next();
};
