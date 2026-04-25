import express from "express";
import {
    addToCart,
    clearCart,
    getCart,
    mergeGuestCart,
    removeCartItem,
    updateCartItem
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.post("/merge", mergeGuestCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeCartItem);
router.delete("/", clearCart);

export default router;
