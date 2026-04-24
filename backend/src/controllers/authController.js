import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/token.js";

function authPayload(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
    };
}

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("name, email and password are required");
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
        res.status(400);
        throw new Error("Email is already registered");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
        success: true,
        data: {
            user: authPayload(user),
            token
        }
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id, user.role);

    res.json({
        success: true,
        data: {
            user: authPayload(user),
            token
        }
    });
});

export const getProfile = asyncHandler(async (req, res) => {
    res.json({ success: true, data: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const { name, email, password, address } = req.body;

    if (email && email !== user.email) {
        const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
        if (exists) {
            res.status(400);
            throw new Error("Email is already registered");
        }
        user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (address) user.address = { ...user.address, ...address };

    const updated = await user.save();
    const token = generateToken(updated._id, updated.role);

    res.json({
        success: true,
        data: { user: authPayload(updated), token }
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+resetPasswordToken +resetPasswordExpire");

    if (user) {
        const resetToken = user.createResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const html = `<p>Use the link below to reset your password. This link expires in 10 minutes.</p><p><a href=\"${resetUrl}\">Reset Password</a></p>`;

        await sendEmail({
            to: user.email,
            subject: "TechMarket Password Reset",
            html
        });
    }

    res.json({
        success: true,
        data: { message: "If that email exists, a reset link has been sent." }
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select("+password +resetPasswordToken +resetPasswordExpire");

    if (!user) {
        res.status(400);
        throw new Error("Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
        success: true,
        data: { message: "Password reset successful" }
    });
});
