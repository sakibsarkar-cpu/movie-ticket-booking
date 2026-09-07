import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const seats = await Seat.find().sort({
            seatID: 1
        });

        res.json(seats);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch seats",
            error: error.message
        });
    }
});

router.get("/screen/:screenID", async (req, res) => {
    try {
        const seats = await Seat.find({
            screenID: Number(req.params.screenID)
        }).sort({
            seatNumber: 1
        });

        res.json(seats);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch screen seats",
            error: error.message
        });
    }
});

router.get("/:seatID", async (req, res) => {
    try {
        const seat = await Seat.findOne({
            seatID: req.params.seatID
        });

        if (!seat) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }

        res.json(seat);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch seat",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingSeat = await Seat.findOne({
            seatID: req.body.seatID
        });

        if (existingSeat) {
            return res.status(400).json({
                message: "Seat ID already exists"
            });
        }

        const seat = await Seat.create(req.body);

        res.status(201).json({
            message: "Seat created successfully",
            seat
        });
    } catch (error) {
        res.status(500).json({
            message: "Seat creation failed",
            error: error.message
        });
    }
});

router.put("/:seatID", async (req, res) => {
    try {
        const seat = await Seat.findOneAndUpdate(
            {
                seatID: req.params.seatID
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!seat) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }

        res.json({
            message: "Seat updated successfully",
            seat
        });
    } catch (error) {
        res.status(500).json({
            message: "Seat update failed",
            error: error.message
        });
    }
});

router.delete("/:seatID", async (req, res) => {
    try {
        const seat = await Seat.findOneAndDelete({
            seatID: req.params.seatID
        });

        if (!seat) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }

        res.json({
            message: "Seat deleted successfully",
            seat
        });
    } catch (error) {
        res.status(500).json({
            message: "Seat deletion failed",
            error: error.message
        });
    }
});

export default router;