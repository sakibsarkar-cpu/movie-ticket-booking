import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find({
            role: "customer"
        }).select("-password").sort({
            createdAt: 1
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

router.put("/:userID", async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: {
                $ne: req.params.userID
            },
            role: "customer"
        });

        if (existingUser) {
            return res.status(400).json({
                message: "This email is already registered with another account"
            });
        }

        const user = await User.findOneAndUpdate(
            {
                _id: req.params.userID,
                role: "customer"
            },
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone ? phone.trim() : ""
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
});

router.put("/:userID/password", async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long"
            });
        }

        const user = await User.findOne({
            _id: req.params.userID,
            role: "customer"
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const newHashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = newHashedPassword;

        await user.save();

        res.json({
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Password change failed",
            error: error.message
        });
    }
});

router.put("/:userID/status", async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.userID,
            role: "customer"
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.status =
            user.status === "active"
                ? "blocked"
                : "active";

        await user.save();

        res.json({
            message:
                user.status === "active"
                    ? "User activated successfully"
                    : "User blocked successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user status",
            error: error.message
        });
    }
});

router.delete("/:userID", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            _id: req.params.userID,
            role: "customer"
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "User deletion failed",
            error: error.message
        });
    }
});

export default router;