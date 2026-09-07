import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaRobot,
    FaStar,
    FaFilm,
} from "react-icons/fa";

const movies = [
    {
        movieID: 1,
        title: "Inception",
        genre: "Sci-Fi",
        language: "English",
        description:
            "A skilled extractor enters people's dreams to steal valuable secrets.",
        rating: 8.8,
    },
    {
        movieID: 2,
        title: "Interstellar",
        genre: "Sci-Fi",
        language: "English",
        description:
            "A team of explorers travels through a wormhole in search of a new home for humanity.",
        rating: 8.7,
    },
    {
        movieID: 3,
        title: "The Dark Knight",
        genre: "Action",
        language: "English",
        description:
            "Batman faces a dangerous criminal who creates chaos across Gotham City.",
        rating: 9.0,
    },
    {
        movieID: 4,
        title: "Avengers: Endgame",
        genre: "Action",
        language: "English",
        description:
            "The Avengers attempt to undo the destruction caused by Thanos.",
        rating: 8.4,
    },
    {
        movieID: 5,
        title: "Parasite",
        genre: "Drama",
        language: "Korean",
        description:
            "Two families become connected through an unexpected and complicated relationship.",
        rating: 8.5,
    },
    {
        movieID: 6,
        title: "The Matrix",
        genre: "Sci-Fi",
        language: "English",
        description:
            "A computer programmer discovers that reality is not what it appears to be.",
        rating: 8.7,
    },
];

function AIRecommendations() {

    const [genre, setGenre] = useState("All");
    const [language, setLanguage] = useState("All");
    const [recommendations, setRecommendations] = useState([]);
    const [showResults, setShowResults] = useState(false);


    const handleRecommendation = (event) => {

        event.preventDefault();

        let filteredMovies = [...movies];


        if (genre !== "All") {

            filteredMovies = filteredMovies.filter(
                (movie) =>
                    movie.genre === genre
            );

        }


        if (language !== "All") {

            filteredMovies = filteredMovies.filter(
                (movie) =>
                    movie.language === language
            );

        }


        /*
            Smart Recommendation Logic

            Movies are sorted according to
            their rating so that the highest
            rated suitable movies appear first.
        */

        filteredMovies.sort(
            (a, b) =>
                b.rating - a.rating
        );


        setRecommendations(
            filteredMovies
        );

        setShowResults(true);

    };


    const handleReset = () => {

        setGenre("All");
        setLanguage("All");
        setRecommendations([]);
        setShowResults(false);

    };


    return (
        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-6xl mx-auto">


                {/* Back Button */}

                <Link
                    to="/"
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Home
                </Link>


                {/* Page Header */}

                <div className="text-center mb-10">

                    <div className="flex justify-center items-center gap-3">

                        <FaRobot className="text-primary text-4xl" />

                        <h1 className="text-4xl font-bold">
                            AI Movie Recommendations
                        </h1>

                    </div>

                    <p className="text-base-content/60 mt-4 max-w-2xl mx-auto">
                        Tell us what kind of movie you want to watch,
                        and our smart recommendation system will suggest
                        suitable movies for you.
                    </p>

                </div>


                {/* Preference Section */}

                <div className="card bg-base-100 shadow-md max-w-3xl mx-auto">

                    <div className="card-body">

                        <h2 className="text-2xl font-bold text-center">
                            Find Your Movie
                        </h2>

                        <p className="text-center text-base-content/60 mt-1">
                            Select your preferred genre and language.
                        </p>


                        <form
                            onSubmit={handleRecommendation}
                            className="mt-6"
                        >

                            <div className="grid md:grid-cols-2 gap-5">


                                {/* Genre */}

                                <div>

                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Preferred Genre
                                        </span>
                                    </label>

                                    <select
                                        value={genre}
                                        onChange={(event) =>
                                            setGenre(
                                                event.target.value
                                            )
                                        }
                                        className="select select-bordered w-full"
                                    >

                                        <option value="All">
                                            All Genres
                                        </option>

                                        <option value="Sci-Fi">
                                            Sci-Fi
                                        </option>

                                        <option value="Action">
                                            Action
                                        </option>

                                        <option value="Drama">
                                            Drama
                                        </option>

                                    </select>

                                </div>


                                {/* Language */}

                                <div>

                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Preferred Language
                                        </span>
                                    </label>

                                    <select
                                        value={language}
                                        onChange={(event) =>
                                            setLanguage(
                                                event.target.value
                                            )
                                        }
                                        className="select select-bordered w-full"
                                    >

                                        <option value="All">
                                            All Languages
                                        </option>

                                        <option value="English">
                                            English
                                        </option>

                                        <option value="Korean">
                                            Korean
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="flex gap-3 mt-6">

                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                >
                                    <FaRobot />
                                    Get Recommendations
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn btn-outline"
                                >
                                    Reset
                                </button>

                            </div>

                        </form>

                    </div>

                </div>


                {/* Recommendation Results */}

                {showResults && (

                    <div className="mt-12">


                        <div className="text-center mb-8">

                            <p className="text-primary font-semibold">
                                SMART RESULTS
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                Recommended Movies
                            </h2>

                            <p className="text-base-content/60 mt-2">
                                Based on your selected preferences.
                            </p>

                        </div>


                        {recommendations.length > 0 ? (

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {recommendations.map(
                                    (movie) => (

                                        <div
                                            key={movie.movieID}
                                            className="card bg-base-100 shadow-md hover:shadow-xl transition"
                                        >

                                            <div className="card-body">


                                                {/* Movie Icon */}

                                                <div className="flex justify-between items-start">

                                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">

                                                        <FaFilm className="text-primary text-xl" />

                                                    </div>


                                                    <div className="badge badge-primary">

                                                        {movie.genre}

                                                    </div>

                                                </div>


                                                {/* Movie Title */}

                                                <h3 className="text-2xl font-bold mt-4">

                                                    {movie.title}

                                                </h3>


                                                {/* Rating */}

                                                <div className="flex items-center gap-2 mt-2">

                                                    <FaStar className="text-warning" />

                                                    <span className="font-semibold">

                                                        {movie.rating}

                                                    </span>

                                                    <span className="text-sm text-base-content/60">
                                                        / 10
                                                    </span>

                                                </div>


                                                {/* Language */}

                                                <p className="text-sm text-base-content/60 mt-2">

                                                    Language:{" "}

                                                    <span className="font-semibold text-base-content">
                                                        {movie.language}
                                                    </span>

                                                </p>


                                                {/* Description */}

                                                <p className="text-base-content/70 mt-4">

                                                    {movie.description}

                                                </p>


                                                {/* View Movie */}

                                                <Link
                                                    to={`/movies/${movie.movieID}`}
                                                    className="btn btn-primary w-full mt-5"
                                                >
                                                    View Movie
                                                </Link>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="card bg-base-100 shadow-md">

                                <div className="card-body text-center py-12">

                                    <FaFilm className="text-primary text-5xl mx-auto" />

                                    <h3 className="text-2xl font-bold mt-4">
                                        No Movies Found
                                    </h3>

                                    <p className="text-base-content/60 mt-2">
                                        No movie matches your selected
                                        preferences.
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AIRecommendations;