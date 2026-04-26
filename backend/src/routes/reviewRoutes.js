import express from "express";
import { addReview, deleteReview, getReviewsByProduct } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/:productId", protect, addReview);
router.delete("/delete/:id", protect, deleteReview);

export default router;
