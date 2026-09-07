import express from "express";
import Genre from "../models/Genre.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const genres = await Genre.find().sort({
            genreID: 1
        });

        res.json(genres);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch genres",
            error: error.message
        });
    }
});

router.get("/:genreID", async (req, res) => {
    try {
        const genre = await Genre.findOne({
            genreID: Number(req.params.genreID)
        });

        if (!genre) {
            return res.status(404).json({
                message: "Genre not found"
            });
        }

        res.json(genre);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch genre",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingGenreID =
            await Genre.findOne({
                genreID: req.body.genreID
            });

        if (existingGenreID) {
            return res.status(400).json({
                message: "Genre ID already exists"
            });
        }

        const existingGenreName =
            await Genre.findOne({
                genreName: {
                    $regex: `^${req.body.genreName.trim()}$`,
                    $options: "i"
                }
            });

        if (existingGenreName) {
            return res.status(400).json({
                message: "Genre already exists"
            });
        }

        const genre = await Genre.create({
            genreID: Number(req.body.genreID),
            genreName: req.body.genreName.trim()
        });

        res.status(201).json({
            message: "Genre created successfully",
            genre
        });
    } catch (error) {
        res.status(500).json({
            message: "Genre creation failed",
            error: error.message
        });
    }
});

router.put("/:genreID", async (req, res) => {
    try {
        const existingGenreName =
            await Genre.findOne({
                genreName: {
                    $regex: `^${req.body.genreName.trim()}$`,
                    $options: "i"
                },
                genreID: {
                    $ne: Number(req.params.genreID)
                }
            });

        if (existingGenreName) {
            return res.status(400).json({
                message: "Genre already exists"
            });
        }

        const genre =
            await Genre.findOneAndUpdate(
                {
                    genreID:
                        Number(req.params.genreID)
                },
                {
                    genreName:
                        req.body.genreName.trim()
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!genre) {
            return res.status(404).json({
                message: "Genre not found"
            });
        }

        res.json({
            message: "Genre updated successfully",
            genre
        });
    } catch (error) {
        res.status(500).json({
            message: "Genre update failed",
            error: error.message
        });
    }
});

router.delete("/:genreID", async (req, res) => {
    try {
        const genre =
            await Genre.findOneAndDelete({
                genreID:
                    Number(req.params.genreID)
            });

        if (!genre) {
            return res.status(404).json({
                message: "Genre not found"
            });
        }

        res.json({
            message: "Genre deleted successfully",
            genre
        });
    } catch (error) {
        res.status(500).json({
            message: "Genre deletion failed",
            error: error.message
        });
    }
});

export default router;