import express from "express";
import Screen from "../models/Screen.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const screens = await Screen.find().sort({
            screenID: 1
        });

        res.json(screens);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch screens",
            error: error.message
        });
    }
});

router.get("/active", async (req, res) => {
    try {
        const screens = await Screen.find({
            status: "Active"
        }).sort({
            screenID: 1
        });

        res.json(screens);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active screens",
            error: error.message
        });
    }
});

router.get("/:screenID", async (req, res) => {
    try {
        const screen = await Screen.findOne({
            screenID: Number(req.params.screenID)
        });

        if (!screen) {
            return res.status(404).json({
                message: "Screen not found"
            });
        }

        res.json(screen);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch screen",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingScreen =
            await Screen.findOne({
                screenID: req.body.screenID
            });

        if (existingScreen) {
            return res.status(400).json({
                message: "Screen ID already exists"
            });
        }

        const screen =
            await Screen.create(req.body);

        res.status(201).json({
            message: "Screen created successfully",
            screen
        });
    } catch (error) {
        res.status(500).json({
            message: "Screen creation failed",
            error: error.message
        });
    }
});

router.put("/:screenID", async (req, res) => {
    try {
        const screen =
            await Screen.findOneAndUpdate(
                {
                    screenID:
                        Number(req.params.screenID)
                },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!screen) {
            return res.status(404).json({
                message: "Screen not found"
            });
        }

        res.json({
            message: "Screen updated successfully",
            screen
        });
    } catch (error) {
        res.status(500).json({
            message: "Screen update failed",
            error: error.message
        });
    }
});

router.delete("/:screenID", async (req, res) => {
    try {
        const screen =
            await Screen.findOneAndDelete({
                screenID:
                    Number(req.params.screenID)
            });

        if (!screen) {
            return res.status(404).json({
                message: "Screen not found"
            });
        }

        res.json({
            message: "Screen deleted successfully",
            screen
        });
    } catch (error) {
        res.status(500).json({
            message: "Screen deletion failed",
            error: error.message
        });
    }
});

export default router;