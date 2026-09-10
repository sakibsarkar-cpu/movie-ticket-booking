import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaRobot,
    FaStar,
    FaFilm,
} from "react-icons/fa";

function AIRecommendations() {

    const [movies, setMovies] =
        useState([]);

    const [genres, setGenres] =
        useState([]);

    const [languages, setLanguages] =
        useState([]);

    const [genre, setGenre] =
        useState("All");

    const [language, setLanguage] =
        useState("All");

    const [recommendations, setRecommendations] =
        useState([]);

    const [showResults, setShowResults] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    movieResponse,
                    genreResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/movies"
                    ),
                    fetch(
                        "http://localhost:5000/api/genres"
                    ),
                ]);

                const movieData =
                    await movieResponse.json();

                const genreData =
                    await genreResponse.json();

                if (!movieResponse.ok) {

                    throw new Error(
                        movieData.message ||
                        "Failed to load movies."
                    );

                }

                if (!genreResponse.ok) {

                    throw new Error(
                        genreData.message ||
                        "Failed to load genres."
                    );

                }

                const movieList =
                    Array.isArray(movieData)
                        ? movieData
                        : [];

                const genreList =
                    Array.isArray(genreData)
                        ? genreData
                        : [];

                setMovies(movieList);
                setGenres(genreList);

                const uniqueLanguages =
                    [
                        ...new Set(
                            movieList
                                .map(
                                    (movie) =>
                                        movie.language
                                )
                                .filter(
                                    (item) =>
                                        item &&
                                        item.trim()
                                )
                        ),
                    ].sort();

                setLanguages(
                    uniqueLanguages
                );

            } catch (error) {

                console.error(
                    "Failed to load recommendation data:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load recommendation data."
                );

                setMovies([]);
                setGenres([]);
                setLanguages([]);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    const handleRecommendation =
        (event) => {

            event.preventDefault();

            let filteredMovies =
                [...movies];

            filteredMovies =
                filteredMovies.filter(
                    (movie) =>
                        movie.status !==
                            "Inactive" &&
                        movie.status !==
                            false
                );

            if (genre !== "All") {

                filteredMovies =
                    filteredMovies.filter(
                        (movie) =>
                            (
                                movie.genreName ||
                                movie.genre ||
                                ""
                            ) === genre
                    );

            }

            if (language !== "All") {

                filteredMovies =
                    filteredMovies.filter(
                        (movie) =>
                            movie.language ===
                            language
                    );

            }

            filteredMovies.sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
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

                <Link
                    to="/"
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Home
                </Link>

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

                {loading ? (

                    <div className="card bg-base-100 shadow-md max-w-3xl mx-auto">

                        <div className="card-body flex items-center justify-center py-16">

                            <span className="loading loading-spinner loading-lg text-primary"></span>

                            <p className="text-base-content/60 mt-3">
                                Loading movies and preferences...
                            </p>

                        </div>

                    </div>

                ) : error ? (

                    <div className="card bg-base-100 shadow-md max-w-3xl mx-auto">

                        <div className="card-body text-center py-12">

                            <FaFilm className="text-5xl text-base-content/30 mx-auto" />

                            <h2 className="text-2xl font-bold mt-4">
                                Unable to Load Recommendations
                            </h2>

                            <p className="text-base-content/60 mt-2">
                                {error}
                            </p>

                        </div>

                    </div>

                ) : (

                    <>

                        <div className="card bg-base-100 shadow-md max-w-3xl mx-auto">

                            <div className="card-body">

                                <h2 className="text-2xl font-bold text-center">
                                    Find Your Movie
                                </h2>

                                <p className="text-center text-base-content/60 mt-1">
                                    Select your preferred genre and language.
                                </p>

                                <form
                                    onSubmit={
                                        handleRecommendation
                                    }
                                    className="mt-6"
                                >

                                    <div className="grid md:grid-cols-2 gap-5">

                                        <div>

                                            <label className="label">

                                                <span className="label-text font-semibold">
                                                    Preferred Genre
                                                </span>

                                            </label>

                                            <select
                                                value={
                                                    genre
                                                }
                                                onChange={
                                                    (event) =>
                                                        setGenre(
                                                            event.target.value
                                                        )
                                                }
                                                className="select select-bordered w-full"
                                            >

                                                <option value="All">
                                                    All Genres
                                                </option>

                                                {genres.map(
                                                    (item) => (

                                                        <option
                                                            key={
                                                                item.genreID
                                                            }
                                                            value={
                                                                item.genreName
                                                            }
                                                        >
                                                            {
                                                                item.genreName
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                        <div>

                                            <label className="label">

                                                <span className="label-text font-semibold">
                                                    Preferred Language
                                                </span>

                                            </label>

                                            <select
                                                value={
                                                    language
                                                }
                                                onChange={
                                                    (event) =>
                                                        setLanguage(
                                                            event.target.value
                                                        )
                                                }
                                                className="select select-bordered w-full"
                                            >

                                                <option value="All">
                                                    All Languages
                                                </option>

                                                {languages.map(
                                                    (item) => (

                                                        <option
                                                            key={
                                                                item
                                                            }
                                                            value={
                                                                item
                                                            }
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>

                                    </div>

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
                                            onClick={
                                                handleReset
                                            }
                                            className="btn btn-outline"
                                        >
                                            Reset
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

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
                                        Movies are filtered according to
                                        your selected preferences and ranked
                                        by rating.
                                    </p>

                                </div>

                                {recommendations.length > 0 ? (

                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                        {recommendations.map(
                                            (movie) => (

                                                <div
                                                    key={
                                                        movie.movieID
                                                    }
                                                    className="card bg-base-100 shadow-md hover:shadow-xl transition"
                                                >

                                                    <figure className="h-72">

                                                        {movie.image ? (

                                                            <img
                                                                src={
                                                                    movie.image
                                                                }
                                                                alt={
                                                                    movie.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="w-full h-full bg-base-300 flex items-center justify-center">

                                                                <FaFilm className="text-5xl text-base-content/30" />

                                                            </div>

                                                        )}

                                                    </figure>

                                                    <div className="card-body p-5">

                                                        <div className="flex justify-between items-start gap-2">

                                                            <h3 className="text-xl font-bold">
                                                                {
                                                                    movie.title
                                                                }
                                                            </h3>

                                                            <div className="flex items-center gap-1 shrink-0">

                                                                <FaStar className="text-warning" />

                                                                <span className="font-semibold">
                                                                    {
                                                                        movie.rating
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-2">

                                                            <span className="badge badge-outline">

                                                                {
                                                                    movie.genreName ||
                                                                    movie.genre ||
                                                                    "Unknown"
                                                                }

                                                            </span>

                                                            <span className="badge badge-outline">

                                                                {
                                                                    movie.language ||
                                                                    "Unknown"
                                                                }

                                                            </span>

                                                        </div>

                                                        <p className="text-base-content/70 mt-3 line-clamp-3">
                                                            {
                                                                movie.description
                                                            }
                                                        </p>

                                                        <Link
                                                            to={`/movies/${movie.movieID}`}
                                                            className="btn btn-primary w-full mt-4"
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
                                                No active movie matches your
                                                selected preferences.
                                            </p>

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>

    );
}

export default AIRecommendations;