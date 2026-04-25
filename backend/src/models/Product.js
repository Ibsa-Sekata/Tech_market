import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            max: 999999
        },
        category: {
            type: String,
            required: true,
            enum: ["Laptops", "Phones", "Accessories", "Software"]
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 2000
        },
        imageUrl: {
            type: String,
            required: true,
            match: /^https?:\/\/\S+$/i
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Stock must be an integer"
            }
        },
        ratings: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0, min: 0 }
    },
    { timestamps: true }
);

productSchema.pre("validate", function setSlug(next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
    }
    next();
});

productSchema.index({ name: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
