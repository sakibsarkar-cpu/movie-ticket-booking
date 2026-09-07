import mongoose from "mongoose";
import dotenv from "dotenv";
import Genre from "./models/Genre.js";

dotenv.config();

const genres = [
    {
        genreID: 1,
        genreName: "Action"
    },
    {
        genreID: 2,
        genreName: "Comedy"
    },
    {
        genreID: 3,
        genreName: "Drama"
    },
    {
        genreID: 4,
        genreName: "Horror"
    },
    {
        genreID: 5,
        genreName: "Sci-Fi"
    },
    {
        genreID: 6,
        genreName: "Thriller"
    },
    {
        genreID: 7,
        genreName: "Thriller/Mystery"
    }
];

const seedGenres = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        await Genre.deleteMany({});

        await Genre.insertMany(genres);

        console.log(
            "7 genres inserted successfully"
        );

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Genre seeding failed:",
            error.message
        );

        process.exit(1);
    }
};

seedGenres();