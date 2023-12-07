import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";

export const getVendors = async (req, res) => {
    try {
        const size = parseInt(req.query.size);
        const location = parseInt(req.query.location) || 0;
        let vendors;

        if (location !== 1 && location !== 0) {
            return res.status(400).json({
                error: true,
                message: "Invalid value parameter location",
            });
        }

        if (location === 1) {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: [
                            "image_url",
                            "name",
                            "no_hp",
                            "latitude",
                            "longitude",
                        ],
                    },
                ],
                limit: size ? size : 10,
            });
        } else {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: [
                            "image_url",
                            "name",
                            "no_hp",
                        ],
                    },
                ],
                limit: size ? size : 10,
            });
        }

        const formattedVendors = vendors.map((vendor) => {
            return {
                vendorId: vendor.vendorId,
                userId: vendor.userId,
                image_url: vendor.user.image_url,
                name: vendor.user.name,
                name_vendor: vendor.name_vendor,
                no_hp: vendor.user.no_hp,
                products: vendor.products,
                minPrice: vendor.minPrice,
                maxPrice: vendor.maxPrice,
                latitude: vendor.user.latitude,
                longitude: vendor.user.longitude,
            };
        });

        res.json({
            error: false,
            message: "Vendors fetched successfully",
            listVendors: formattedVendors,
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
