import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, minlength: 5, maxlength: 500 }
    },
    { timestamps: true }
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
