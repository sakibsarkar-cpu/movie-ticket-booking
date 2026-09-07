import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import ticketPriceRoutes from "./routes/ticketPriceRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/ticket-prices", ticketPriceRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "MovieBook Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});