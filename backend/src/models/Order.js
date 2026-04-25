import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        imageUrl: { type: String }
    },
    { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        orderItems: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must include at least one item"
            }
        },
        shippingAddress: { type: shippingAddressSchema, required: true },
        paymentMethod: {
            type: String,
            enum: ["Credit Card", "PayPal"],
            required: true
        },
        paymentResult: {
            transactionId: { type: String },
            status: { type: String },
            emailAddress: { type: String }
        },
        totalPrice: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
            index: true
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
