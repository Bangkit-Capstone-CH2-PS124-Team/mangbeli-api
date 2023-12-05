/* eslint-disable max-len */
import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";

export const getVendors = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized: Missing access token",
            });
        }

        const {size, location} = req.query;
        let vendors;

        if (location === "1") {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: ["photo_url", "name", "no_hp", "latitude", "longitude"],
                    },
                ],
                limit: size ? parseInt(size) : null,
            });
        } else {
            vendors = await dbVendors.findAll({
                include: [
                    {
                        model: dbUsers,
                        attributes: ["photo_url", "name", "no_hp"],
                    },
                ],
                limit: size ? parseInt(size) : null,
            });
        }

        const formattedVendors = vendors.map((vendor) => {
            return {
                vendorId: vendor.vendorId,
                userId: vendor.userId,
                photo_url: vendor.user.photo_url,
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
        console.error("[ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            errorMessage: err.message,
        });
    }
};
