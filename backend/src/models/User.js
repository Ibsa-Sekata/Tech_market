import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        street: { type: String, trim: true, maxlength: 100 },
        city: { type: String, trim: true, maxlength: 50 },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true, maxlength: 50 }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
            match: /^[A-Za-z\s'-]+$/
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        address: addressSchema,
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpire: { type: Date, select: false }
    },
    { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createResetToken = function createResetToken() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

// `email` field is declared with `unique: true` above; avoid duplicate index declaration.

const User = mongoose.model("User", userSchema);

export default User;
