import express from "express";
import TicketPrice from "../models/TicketPrice.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const ticketPrices =
            await TicketPrice.find().sort({
                priceID: 1
            });

        res.json(ticketPrices);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch ticket prices",
            error: error.message
        });
    }
});

router.get("/:priceID", async (req, res) => {
    try {
        const ticketPrice =
            await TicketPrice.findOne({
                priceID:
                    Number(req.params.priceID)
            });

        if (!ticketPrice) {
            return res.status(404).json({
                message: "Ticket price not found"
            });
        }

        res.json(ticketPrice);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch ticket price",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingPriceID =
            await TicketPrice.findOne({
                priceID: req.body.priceID
            });

        if (existingPriceID) {
            return res.status(400).json({
                message: "Price ID already exists"
            });
        }

        const existingPrice =
            await TicketPrice.findOne({
                movieID:
                    Number(req.body.movieID),
                screenID:
                    Number(req.body.screenID)
            });

        if (existingPrice) {
            return res.status(400).json({
                message:
                    "A ticket price already exists for this movie and screen."
            });
        }

        const ticketPrice =
            await TicketPrice.create({
                priceID:
                    Number(req.body.priceID),
                movieID:
                    Number(req.body.movieID),
                branchID:
                    Number(req.body.branchID),
                screenID:
                    Number(req.body.screenID),
                price:
                    Number(req.body.price),
                status:
                    req.body.status
            });

        res.status(201).json({
            message:
                "Ticket price created successfully",
            ticketPrice
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Ticket price creation failed",
            error: error.message
        });
    }
});

router.put("/:priceID", async (req, res) => {
    try {
        const existingPrice =
            await TicketPrice.findOne({
                movieID:
                    Number(req.body.movieID),
                screenID:
                    Number(req.body.screenID),
                priceID: {
                    $ne:
                        Number(
                            req.params.priceID
                        )
                }
            });

        if (existingPrice) {
            return res.status(400).json({
                message:
                    "A ticket price already exists for this movie and screen."
            });
        }

        const ticketPrice =
            await TicketPrice.findOneAndUpdate(
                {
                    priceID:
                        Number(
                            req.params.priceID
                        )
                },
                {
                    movieID:
                        Number(req.body.movieID),
                    branchID:
                        Number(req.body.branchID),
                    screenID:
                        Number(req.body.screenID),
                    price:
                        Number(req.body.price),
                    status:
                        req.body.status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!ticketPrice) {
            return res.status(404).json({
                message:
                    "Ticket price not found"
            });
        }

        res.json({
            message:
                "Ticket price updated successfully",
            ticketPrice
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Ticket price update failed",
            error: error.message
        });
    }
});

router.delete("/:priceID", async (req, res) => {
    try {
        const ticketPrice =
            await TicketPrice.findOneAndDelete({
                priceID:
                    Number(
                        req.params.priceID
                    )
            });

        if (!ticketPrice) {
            return res.status(404).json({
                message:
                    "Ticket price not found"
            });
        }

        res.json({
            message:
                "Ticket price deleted successfully",
            ticketPrice
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Ticket price deletion failed",
            error: error.message
        });
    }
});

export default router;