import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().sort({
            movieID: 1
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch movies",
            error: error.message
        });
    }
});

router.get("/active", async (req, res) => {
    try {
        const movies = await Movie.find({
            status: "active"
        }).sort({
            movieID: 1
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active movies",
            error: error.message
        });
    }
});

router.get("/:movieID", async (req, res) => {
    try {
        const movie = await Movie.findOne({
            movieID: Number(req.params.movieID)
        });

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch movie",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const existingMovie = await Movie.findOne({
            movieID: req.body.movieID
        });

        if (existingMovie) {
            return res.status(400).json({
                message: "Movie ID already exists"
            });
        }

        const movie = await Movie.create(req.body);

        res.status(201).json({
            message: "Movie created successfully",
            movie
        });
    } catch (error) {
        res.status(500).json({
            message: "Movie creation failed",
            error: error.message
        });
    }
});

router.put("/:movieID", async (req, res) => {
    try {
        const movie = await Movie.findOneAndUpdate(
            {
                movieID: Number(req.params.movieID)
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie updated successfully",
            movie
        });
    } catch (error) {
        res.status(500).json({
            message: "Movie update failed",
            error: error.message
        });
    }
});

router.delete("/:movieID", async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({
            movieID: Number(req.params.movieID)
        });

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully",
            movie
        });
    } catch (error) {
        res.status(500).json({
            message: "Movie deletion failed",
            error: error.message
        });
    }
});

export default router;