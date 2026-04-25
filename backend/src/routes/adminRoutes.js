import express from "express";
import {
    deleteUser,
    getAllOrders,
    getDashboardStats,
    getUsers,
    updateAnyOrder,
    updateUserRole
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateAnyOrder);
router.get("/stats", getDashboardStats);

export default router;
