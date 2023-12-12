import dbTracks from "../models/tracks.js";

export const getTracks = async (req, res) => {
    try {
        const tracks = await dbTracks.findAll();

        res.json({
            listTracks: tracks,
        });
    } catch (err) {
        console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
