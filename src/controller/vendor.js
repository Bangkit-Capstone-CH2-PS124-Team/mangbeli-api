/* eslint-disable max-len */
import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";
import {calculateDistance} from "../utils/distance.js";

export const myProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const role = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: ["role"],
        }).then((user) => user?.role);

        if (role !== "vendor") {
            return res.status(403).json({
                error: true,
                message: "Invalid role",
            });
        }

        const vendor = await dbVendors.findOne({
            where: {
                userId,
            },
        });

        res.json({
            error: false,
            message: "Vendor fetched successfully",
            dataVendor: vendor,
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

export const patchProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const {nameVendor, products, minPrice, maxPrice} = req.body;

        const role = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: ["role"],
        }).then((user) => user?.role);

        if (role !== "vendor") {
            return res.status(403).json({
                error: true,
                message: "Invalid role",
            });
        }

        await dbVendors.update(
            {
                nameVendor,
                products,
                minPrice,
                maxPrice,
            },
            {
                where: {
                    userId,
                },
            },
        );
        res.json({
            error: false,
            message: "Vendor updated successfully",
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

export const getVendor = async (req, res) => {
    try {
        const userId = req.userId;
        const vendorId = req.query.vendorId;

        const user = await dbUsers.findOne({
            where: {
                userId,
            },
            attributes: ["latitude", "longitude"],
        });

        if (!user.latitude || !user.longitude) {
            return res.status(400).json({
                error: true,
                message: "User coordinates not found. Please turn on your location",
            });
        }

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
            include: [
                {
                    model: dbUsers,
                    attributes: ["imageUrl", "name", "noHp", "latitude", "longitude"],
                },
            ],
        });

        if (!vendor) {
            return res.status(404).json({
                error: true,
                message: "Vendor not found",
            });
        }

        const distance = calculateDistance(
            user.latitude,
            user.longitude,
            vendor.user.latitude,
            vendor.user.longitude,
        );

        const formattedVendor = {
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
            distance: distance,
        };

        res.json({
            error: false,
            message: "Vendor fetched successfully",
            dataVendor: formattedVendor,
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
