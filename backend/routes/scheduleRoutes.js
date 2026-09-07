import express from "express";
import ShowSchedule from "../models/ShowSchedule.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const schedules = await ShowSchedule.find().sort({
            scheduleID: 1
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch show schedules",
            error: error.message
        });
    }
});

router.get("/active", async (req, res) => {
    try {
        const schedules = await ShowSchedule.find({
            status: "Active"
        }).sort({
            scheduleID: 1
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active show schedules",
            error: error.message
        });
    }
});

router.get("/movie/:movieID", async (req, res) => {
    try {
        const schedules = await ShowSchedule.find({
            movieID: Number(req.params.movieID),
            status: "Active"
        }).sort({
            showDate: 1,
            startTime: 1
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch movie schedules",
            error: error.message
        });
    }
});

router.get("/branch/:branchID", async (req, res) => {
    try {
        const schedules = await ShowSchedule.find({
            branchID: Number(req.params.branchID),
            status: "Active"
        }).sort({
            showDate: 1,
            startTime: 1
        });

        res.json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch branch schedules",
            error: error.message
        });
    }
});

router.get("/:scheduleID", async (req, res) => {
    try {
        const schedule = await ShowSchedule.findOne({
            scheduleID: Number(req.params.scheduleID)
        });

        if (!schedule) {
            return res.status(404).json({
                message: "Show schedule not found"
            });
        }

        res.json(schedule);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch show schedule",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingSchedule =
            await ShowSchedule.findOne({
                scheduleID: req.body.scheduleID
            });

        if (existingSchedule) {
            return res.status(400).json({
                message: "Schedule ID already exists"
            });
        }

        const schedule =
            await ShowSchedule.create(req.body);

        res.status(201).json({
            message: "Show schedule created successfully",
            schedule
        });
    } catch (error) {
        res.status(500).json({
            message: "Show schedule creation failed",
            error: error.message
        });
    }
});

router.put("/:scheduleID", async (req, res) => {
    try {
        const schedule =
            await ShowSchedule.findOneAndUpdate(
                {
                    scheduleID:
                        Number(req.params.scheduleID)
                },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!schedule) {
            return res.status(404).json({
                message: "Show schedule not found"
            });
        }

        res.json({
            message: "Show schedule updated successfully",
            schedule
        });
    } catch (error) {
        res.status(500).json({
            message: "Show schedule update failed",
            error: error.message
        });
    }
});

router.delete("/:scheduleID", async (req, res) => {
    try {
        const schedule =
            await ShowSchedule.findOneAndDelete({
                scheduleID:
                    Number(req.params.scheduleID)
            });

        if (!schedule) {
            return res.status(404).json({
                message: "Show schedule not found"
            });
        }

        res.json({
            message: "Show schedule deleted successfully",
            schedule
        });
    } catch (error) {
        res.status(500).json({
            message: "Show schedule deletion failed",
            error: error.message
        });
    }
});

export default router;