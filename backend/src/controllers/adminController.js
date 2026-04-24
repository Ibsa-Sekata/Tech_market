import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
});

export const deleteUser = asyncHandler(async (req, res) => {
    if (String(req.user._id) === req.params.id) {
        res.status(400);
        throw new Error("Admin cannot delete own account");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();
    res.json({ success: true, data: { message: "User deleted" } });
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
});

export const updateAnyOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ success: true, data: order });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
    const [userCount, productCount, orderCount, revenueAgg] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { status: { $in: ["Paid", "Shipped", "Delivered"] } } },
            { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
        ])
    ]);

    res.json({
        success: true,
        data: {
            totalUsers: userCount,
            totalProducts: productCount,
            totalOrders: orderCount,
            totalRevenue: revenueAgg[0]?.revenue || 0
        }
    });
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
        res.status(400);
        throw new Error("Invalid role");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.role = role;
    await user.save();

    res.json({ success: true, data: user });
});
