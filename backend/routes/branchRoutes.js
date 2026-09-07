import express from "express";
import CinemaBranch from "../models/CinemaBranch.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const branches = await CinemaBranch.find().sort({
            branchID: 1
        });

        res.json(branches);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cinema branches",
            error: error.message
        });
    }
});

router.get("/active", async (req, res) => {
    try {
        const branches = await CinemaBranch.find({
            status: "Active"
        }).sort({
            branchID: 1
        });

        res.json(branches);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active cinema branches",
            error: error.message
        });
    }
});

router.get("/:branchID", async (req, res) => {
    try {
        const branch = await CinemaBranch.findOne({
            branchID: Number(req.params.branchID)
        });

        if (!branch) {
            return res.status(404).json({
                message: "Cinema branch not found"
            });
        }

        res.json(branch);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cinema branch",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingBranch =
            await CinemaBranch.findOne({
                branchID: req.body.branchID
            });

        if (existingBranch) {
            return res.status(400).json({
                message: "Branch ID already exists"
            });
        }

        const branch =
            await CinemaBranch.create(
                req.body
            );

        res.status(201).json({
            message: "Cinema branch created successfully",
            branch
        });
    } catch (error) {
        res.status(500).json({
            message: "Cinema branch creation failed",
            error: error.message
        });
    }
});

router.put("/:branchID", async (req, res) => {
    try {
        const branch =
            await CinemaBranch.findOneAndUpdate(
                {
                    branchID:
                        Number(req.params.branchID)
                },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!branch) {
            return res.status(404).json({
                message: "Cinema branch not found"
            });
        }

        res.json({
            message: "Cinema branch updated successfully",
            branch
        });
    } catch (error) {
        res.status(500).json({
            message: "Cinema branch update failed",
            error: error.message
        });
    }
});

router.delete("/:branchID", async (req, res) => {
    try {
        const branch =
            await CinemaBranch.findOneAndDelete({
                branchID:
                    Number(req.params.branchID)
            });

        if (!branch) {
            return res.status(404).json({
                message: "Cinema branch not found"
            });
        }

        res.json({
            message: "Cinema branch deleted successfully",
            branch
        });
    } catch (error) {
        res.status(500).json({
            message: "Cinema branch deletion failed",
            error: error.message
        });
    }
});

export default router;