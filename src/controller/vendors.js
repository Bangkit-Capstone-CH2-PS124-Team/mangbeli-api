import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";

export const getVendors = async (req, res) => {
    try {
        const size = parseInt(req.query.size);
        const location = parseInt(req.query.location) || 0;
        const filter = req.query.filter;
        let vendors;

        if (location !== 1 && location !== 0) {
            return res.status(400).json({
                error: true,
                message: "Invalid value parameter location",
            });
        }

        let orderQuery = [];

        if (filter === "name") {
            orderQuery = [["nameVendor", "ASC"]];
        } else if (filter === "minPrice") {
            orderQuery = [["minPrice", "ASC"]];
        } else if (filter === "maxPrice") {
            orderQuery = [["maxPrice", "DESC"]];
        }

        if (location === 1) {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: [
                            "imageUrl",
                            "name",
                            "noHp",
                            "latitude",
                            "longitude",
                        ],
                    },
                ],
                limit: size ? size : 10,
                order: orderQuery,
            });
        } else {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: [
                            "imageUrl",
                            "name",
                            "noHp",
                        ],
                    },
                ],
                limit: size ? size : 10,
                order: orderQuery,
            });
        }

        const formattedVendors = vendors.map((vendor) => {
            return {
                vendorId: vendor.vendorId,
                userId: vendor.userId,
                imageUrl: vendor.user.imageUrl,
                name: vendor.user.name,
                nameVendor: vendor.nameVendor,
                noHp: vendor.user.noHp,
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
