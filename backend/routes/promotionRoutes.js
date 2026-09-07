import express from "express";
import Promotion from "../models/Promotion.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const promotions = await Promotion.find().sort({
            promotionID: 1
        });

        res.json(promotions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch promotions",
            error: error.message
        });
    }
});

router.get("/:promotionID", async (req, res) => {
    try {
        const promotion = await Promotion.findOne({
            promotionID: Number(req.params.promotionID)
        });

        if (!promotion) {
            return res.status(404).json({
                message: "Promotion not found"
            });
        }

        res.json(promotion);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch promotion",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const promotionCode = req.body.promotionCode
            ?.trim()
            .toUpperCase();

        if (!promotionCode) {
            return res.status(400).json({
                message: "Promotion code is required"
            });
        }

        if (
            !req.body.discountPercentage ||
            Number(req.body.discountPercentage) < 1 ||
            Number(req.body.discountPercentage) > 100
        ) {
            return res.status(400).json({
                message:
                    "Discount percentage must be between 1% and 100%."
            });
        }

        if (!req.body.startDate || !req.body.endDate) {
            return res.status(400).json({
                message: "Start date and end date are required."
            });
        }

        if (req.body.endDate < req.body.startDate) {
            return res.status(400).json({
                message:
                    "End date cannot be earlier than the start date."
            });
        }

        if (
            req.body.movieScope === "selected" &&
            (!Array.isArray(req.body.applicableMovieIDs) ||
                req.body.applicableMovieIDs.length === 0)
        ) {
            return res.status(400).json({
                message: "Please select at least one movie."
            });
        }

        const existingPromotionID = await Promotion.findOne({
            promotionID: Number(req.body.promotionID)
        });

        if (existingPromotionID) {
            return res.status(400).json({
                message: "Promotion ID already exists."
            });
        }

        const existingPromotionCode = await Promotion.findOne({
            promotionCode
        });

        if (existingPromotionCode) {
            return res.status(400).json({
                message: "This promotion code already exists."
            });
        }

        const promotion = await Promotion.create({
            promotionID: Number(req.body.promotionID),
            promotionCode,
            description: req.body.description || "",
            discountPercentage:
                Number(req.body.discountPercentage),
            movieScope:
                req.body.movieScope || "all",
            applicableMovieIDs:
                req.body.movieScope === "selected"
                    ? req.body.applicableMovieIDs.map(
                          (id) => Number(id)
                      )
                    : [],
            applicableDay:
                req.body.applicableDay || "All Days",
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            status: req.body.status || "Active"
        });

        res.status(201).json({
            message: "Promotion created successfully",
            promotion
        });
    } catch (error) {
        res.status(500).json({
            message: "Promotion creation failed",
            error: error.message
        });
    }
});

router.put("/:promotionID", async (req, res) => {
    try {
        const promotionID =
            Number(req.params.promotionID);

        const promotionCode = req.body.promotionCode
            ?.trim()
            .toUpperCase();

        if (!promotionCode) {
            return res.status(400).json({
                message: "Promotion code is required"
            });
        }

        if (
            !req.body.discountPercentage ||
            Number(req.body.discountPercentage) < 1 ||
            Number(req.body.discountPercentage) > 100
        ) {
            return res.status(400).json({
                message:
                    "Discount percentage must be between 1% and 100%."
            });
        }

        if (!req.body.startDate || !req.body.endDate) {
            return res.status(400).json({
                message: "Start date and end date are required."
            });
        }

        if (req.body.endDate < req.body.startDate) {
            return res.status(400).json({
                message:
                    "End date cannot be earlier than the start date."
            });
        }

        if (
            req.body.movieScope === "selected" &&
            (!Array.isArray(req.body.applicableMovieIDs) ||
                req.body.applicableMovieIDs.length === 0)
        ) {
            return res.status(400).json({
                message: "Please select at least one movie."
            });
        }

        const existingPromotionCode =
            await Promotion.findOne({
                promotionCode,
                promotionID: {
                    $ne: promotionID
                }
            });

        if (existingPromotionCode) {
            return res.status(400).json({
                message: "This promotion code already exists."
            });
        }

        const promotion =
            await Promotion.findOneAndUpdate(
                {
                    promotionID
                },
                {
                    promotionCode,
                    description:
                        req.body.description || "",
                    discountPercentage:
                        Number(
                            req.body.discountPercentage
                        ),
                    movieScope:
                        req.body.movieScope || "all",
                    applicableMovieIDs:
                        req.body.movieScope === "selected"
                            ? req.body.applicableMovieIDs.map(
                                  (id) => Number(id)
                              )
                            : [],
                    applicableDay:
                        req.body.applicableDay ||
                        "All Days",
                    startDate:
                        req.body.startDate,
                    endDate:
                        req.body.endDate,
                    status:
                        req.body.status || "Active"
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!promotion) {
            return res.status(404).json({
                message: "Promotion not found."
            });
        }

        res.json({
            message: "Promotion updated successfully",
            promotion
        });
    } catch (error) {
        res.status(500).json({
            message: "Promotion update failed",
            error: error.message
        });
    }
});

router.delete("/:promotionID", async (req, res) => {
    try {
        const promotion =
            await Promotion.findOneAndDelete({
                promotionID:
                    Number(req.params.promotionID)
            });

        if (!promotion) {
            return res.status(404).json({
                message: "Promotion not found."
            });
        }

        res.json({
            message: "Promotion deleted successfully",
            promotion
        });
    } catch (error) {
        res.status(500).json({
            message: "Promotion deletion failed",
            error: error.message
        });
    }
});

export default router;