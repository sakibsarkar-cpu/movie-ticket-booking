import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    genreID: {
        type: Number,
        required: true,
        unique: true
    },
    genreName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const Genre = mongoose.model("Genre", genreSchema);

export default Genre;