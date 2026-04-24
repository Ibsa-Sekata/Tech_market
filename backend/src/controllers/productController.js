import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const getProducts = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 12, 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
        filter.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const sortMap = {
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        rating_desc: { ratings: -1 },
        newest: { createdAt: -1 }
    };

    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const [products, totalCount] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit),
        Product.countDocuments(filter)
    ]);

    res.json({
        success: true,
        data: products,
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    Object.assign(product, req.body);
    const updated = await product.save();

    res.json({ success: true, data: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    await product.deleteOne();
    res.json({ success: true, data: { message: "Product deleted" } });
});
