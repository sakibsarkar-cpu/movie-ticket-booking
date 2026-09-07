import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    movieID: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    genreID: {
        type: Number,
        required: true
    },
    genreName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    duration: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;