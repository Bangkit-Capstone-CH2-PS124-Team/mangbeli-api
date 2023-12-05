import dbVendors from "../models/vendors.js";

export const getVendor = async (req, res) => {
    try {
        const vendorId = req.query.vendorId;

        if (!vendorId) {
            return res.status(400).json({
                error: true,
                message: "Parameter vendorId required",
            });
        }

        const vendor = await dbVendors.findOne({
            where: {
                vendorId,
            },
        });

        res.json({
            error: false,
            message: "Vendor fetched successfully",
            dataVendor: vendor,
        });
    } catch (err) {
        // console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
