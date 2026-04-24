import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing. Add it to environment variables.");
        }

        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            throw new Error("JWT_SECRET must be at least 32 characters.");
        }

        await connectDB(process.env.MONGO_URI);

        const server = app.listen(PORT, () => {
            console.log(`TechMarket API running on port ${PORT}`);
        });

        process.on("SIGINT", async () => {
            console.log("Shutting down server...");
            await server.close();
            process.exit(0);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
