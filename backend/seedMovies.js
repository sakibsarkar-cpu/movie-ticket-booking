import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
    {
        movieID: 1,
        title: "Inception",
        genreID: 1,
        genreName: "Sci-Fi",
        description: "A skilled extractor enters people's dreams to steal valuable secrets.",
        duration: "2h 28m",
        language: "English",
        releaseDate: "2010-07-16",
        image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        rating: 8.8,
        status: "active"
    },
    {
        movieID: 2,
        title: "Interstellar",
        genreID: 1,
        genreName: "Sci-Fi",
        description: "A group of explorers travel through a wormhole in search of a new home for humanity.",
        duration: "2h 49m",
        language: "English",
        releaseDate: "2014-11-07",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        rating: 8.7,
        status: "active"
    },
    {
        movieID: 3,
        title: "The Dark Knight",
        genreID: 2,
        genreName: "Action",
        description: "Batman faces a dangerous criminal who creates chaos across Gotham City.",
        duration: "2h 32m",
        language: "English",
        releaseDate: "2008-07-18",
        image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: 9.0,
        status: "active"
    },
    {
        movieID: 4,
        title: "Avengers: Endgame",
        genreID: 2,
        genreName: "Action",
        description: "The Avengers attempt to reverse the devastating events that changed the universe.",
        duration: "3h 1m",
        language: "English",
        releaseDate: "2019-04-26",
        image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        rating: 8.4,
        status: "active"
    },
    {
        movieID: 5,
        title: "Parasite",
        genreID: 3,
        genreName: "Drama",
        description: "A struggling family becomes involved with a wealthy household in an unexpected way.",
        duration: "2h 12m",
        language: "Korean",
        releaseDate: "2019-05-30",
        image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        rating: 8.5,
        status: "active"
    },
    {
        movieID: 6,
        title: "The Matrix",
        genreID: 1,
        genreName: "Sci-Fi",
        description: "A computer programmer discovers that reality is not what it appears to be.",
        duration: "2h 16m",
        language: "English",
        releaseDate: "1999-03-31",
        image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        rating: 8.7,
        status: "active"
    },
    {
        movieID: 7,
        title: "Avatar",
        genreID: 1,
        genreName: "Sci-Fi",
        description: "A marine on an alien planet becomes torn between following his orders and protecting the world he has come to love.",
        duration: "2h 42m",
        language: "English",
        releaseDate: "2026-09-10",
        image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        rating: 8.0,
        status: "active"
    }
];

const seedMovies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Movie.deleteMany({});

        await Movie.insertMany(movies);

        console.log("Movies inserted successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Movie seeding failed:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedMovies();