import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    markOrderPaid,
    updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/pay", markOrderPaid);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
