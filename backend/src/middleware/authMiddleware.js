import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401);
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Invalid token");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Invalid token");
    }
});

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403);
        throw new Error("Admin access required");
    }
    next();
};
