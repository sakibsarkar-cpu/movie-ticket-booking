import express from "express";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const booking = await Booking.create(req.body);

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Booking creation failed",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({
            bookingDate: -1
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});

router.get("/customer/:customerID", async (req, res) => {
    try {
        const bookings = await Booking.find({
            customerID: req.params.customerID
        }).sort({
            bookingDate: -1
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customer bookings",
            error: error.message
        });
    }
});

router.get("/schedule/:scheduleID/occupied-seats", async (req, res) => {
    try {
        const scheduleID = Number(req.params.scheduleID);
        const showDate = req.query.showDate;

        const query = {
            scheduleID,
            status: "Confirmed",
            paymentStatus: "Paid"
        };

        if (showDate) {
            query.showDate = showDate;
        }

        const bookings = await Booking.find(query).select(
            "selectedSeats"
        );

        const occupiedSeats = [];

        bookings.forEach((booking) => {
            if (Array.isArray(booking.selectedSeats)) {
                occupiedSeats.push(
                    ...booking.selectedSeats
                );
            }
        });

        res.json({
            scheduleID,
            showDate: showDate || null,
            occupiedSeats: [
                ...new Set(occupiedSeats)
            ]
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch occupied seats",
            error: error.message
        });
    }
});

router.get("/:id/ticket", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({
            bookingID: req.params.id
        });

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch ticket",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });
    }
});

router.put("/:id/cancel", async (req, res) => {
    try {
        const booking =
            await Booking.findByIdAndUpdate(
                req.params.id,
                {
                    status: "Cancelled"
                },
                {
                    new: true
                }
            );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        await Ticket.findOneAndUpdate(
            {
                bookingID: booking._id
            },
            {
                status: "Cancelled"
            }
        );

        res.json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Booking cancellation failed",
            error: error.message
        });
    }
});

router.post("/:id/payment", async (req, res) => {
    try {
        const booking =
            await Booking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const payment =
            await Payment.create({
                bookingID: booking._id,
                ...req.body
            });

        booking.paymentStatus =
            payment.paymentStatus;

        if (
            payment.paymentStatus ===
            "Paid"
        ) {
            booking.status =
                "Confirmed";
        }

        await booking.save();

        res.status(201).json({
            message: "Payment created successfully",
            payment,
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Payment creation failed",
            error: error.message
        });
    }
});

router.post("/:id/ticket", async (req, res) => {
    try {
        const booking =
            await Booking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const ticket =
            await Ticket.create({
                bookingID: booking._id,
                ...req.body
            });

        res.status(201).json({
            message: "Ticket generated successfully",
            ticket
        });
    } catch (error) {
        res.status(500).json({
            message: "Ticket generation failed",
            error: error.message
        });
    }
});

export default router;