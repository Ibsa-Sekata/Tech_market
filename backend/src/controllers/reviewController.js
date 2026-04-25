import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

async function refreshProductRating(productId) {
    const stats = await Review.aggregate([
        { $match: { productId } },
        {
            $group: {
                _id: "$productId",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    const avg = stats[0]?.avgRating ?? 0;
    const count = stats[0]?.count ?? 0;

    await Product.findByIdAndUpdate(productId, {
        ratings: Number(avg.toFixed(1)),
        numReviews: count
    });
}

export const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const review = await Review.findOneAndUpdate(
        { productId, userId: req.user._id },
        { rating, comment },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await refreshProductRating(product._id);
    res.status(201).json({ success: true, data: review });
});

export const getReviewsByProduct = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ productId: req.params.productId })
        .populate("userId", "name")
        .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    if (String(review.userId) !== String(req.user._id) && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Forbidden");
    }

    const productId = review.productId;
    await review.deleteOne();
    await refreshProductRating(productId);

    res.json({ success: true, data: { message: "Review deleted" } });
});
