/* eslint-disable camelcase */
import dbUsers from "../models/users.js";
import dbVendors from "../models/vendors.js";

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

        if (!vendor) {
            return res.status(404).json({
                error: true,
                message: "Vendor not found",
            });
        }

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
