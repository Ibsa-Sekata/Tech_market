import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

async function hydrateCart(cart) {
    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select("name price imageUrl stock");
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const items = cart.items
        .map((item) => {
            const product = productMap.get(String(item.productId));
            if (!product) return null;

            return {
                productId: item.productId,
                quantity: item.quantity,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
                subtotal: product.price * item.quantity
            };
        })
        .filter(Boolean);

    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, totalPrice, itemCount };
}

async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
}

export const getCart = asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    const data = await hydrateCart(cart);
    res.json({ success: true, data });
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => String(entry.productId) === String(productId));

    if (item) {
        item.quantity += Number(quantity);
    } else {
        cart.items.push({ productId, quantity: Number(quantity) });
    }

    const updated = cart.items.find((entry) => String(entry.productId) === String(productId));
    if (updated.quantity > product.stock) {
        res.status(400);
        throw new Error("Quantity exceeds available stock");
    }

    await cart.save();
    const data = await hydrateCart(cart);

    res.status(201).json({ success: true, data });
});

export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.itemId;

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => String(entry.productId) === String(productId));

    if (!item) {
        res.status(404);
        throw new Error("Cart item not found");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (quantity < 1 || quantity > product.stock) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    item.quantity = Number(quantity);
    await cart.save();

    const data = await hydrateCart(cart);
    res.json({ success: true, data });
});

export const removeCartItem = asyncHandler(async (req, res) => {
    const productId = req.params.itemId;
    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter((item) => String(item.productId) !== String(productId));
    await cart.save();

    const data = await hydrateCart(cart);
    res.json({ success: true, data });
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();

    res.json({ success: true, data: { items: [], totalPrice: 0, itemCount: 0 } });
});

export const mergeGuestCart = asyncHandler(async (req, res) => {
    const { items } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    if (Array.isArray(items)) {
        for (const incomingItem of items) {
            const product = await Product.findById(incomingItem.productId);
            if (!product) continue;

            const existing = cart.items.find(
                (entry) => String(entry.productId) === String(incomingItem.productId)
            );

            const targetQuantity = Math.max(Number(incomingItem.quantity) || 1, 1);

            if (existing) {
                existing.quantity = Math.min(existing.quantity + targetQuantity, product.stock);
            } else {
                cart.items.push({
                    productId: incomingItem.productId,
                    quantity: Math.min(targetQuantity, product.stock)
                });
            }
        }

        await cart.save();
    }

    const data = await hydrateCart(cart);
    res.json({ success: true, data });
});
