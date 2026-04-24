import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

function computeTotals(items) {
    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = itemsPrice > 200 ? 0 : 15;
    const tax = Number((itemsPrice * 0.1).toFixed(2));
    const total = Number((itemsPrice + shipping + tax).toFixed(2));

    return { itemsPrice, shipping, tax, total };
}

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
        res.status(400);
        throw new Error("Shipping address and payment method are required");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error("Cart is empty");
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const orderItems = [];

    for (const cartItem of cart.items) {
        const product = productMap.get(String(cartItem.productId));
        if (!product) continue;

        if (cartItem.quantity > product.stock) {
            res.status(400);
            throw new Error(`${product.name} is out of stock for requested quantity`);
        }

        orderItems.push({
            productId: product._id,
            name: product.name,
            quantity: cartItem.quantity,
            price: product.price,
            imageUrl: product.imageUrl
        });
    }

    if (orderItems.length === 0) {
        res.status(400);
        throw new Error("No valid items found in cart");
    }

    const totals = computeTotals(orderItems);

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: totals.total,
        status: "Pending"
    });

    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
        success: true,
        data: {
            order,
            pricing: totals
        }
    });
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (String(order.user._id) !== String(req.user._id) && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Forbidden");
    }

    res.json({ success: true, data: order });
});

export const markOrderPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (String(order.user) !== String(req.user._id) && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Forbidden");
    }

    order.status = "Paid";
    order.paymentResult = {
        transactionId: req.body.transactionId,
        status: req.body.status || "succeeded",
        emailAddress: req.body.emailAddress
    };

    await order.save();

    res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

    if (!allowed.includes(status)) {
        res.status(400);
        throw new Error("Invalid order status");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (status === "Cancelled" && order.status !== "Pending" && req.user.role !== "admin") {
        res.status(400);
        throw new Error("Only pending orders can be cancelled");
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
});
