import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaFilm,
} from "react-icons/fa";

function UpcomingMovies() {

    const [movies, setMovies] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState("");

    useEffect(() => {

        const loadMovies = async () => {

            try {

                setLoading(true);
                setLoadError("");

                const response =
                    await fetch(
                        "http://localhost:5000/api/movies/active"
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch movies"
                    );

                }

                const formattedMovies =
                    Array.isArray(data)
                        ? data.map((movie) => ({
                            ...movie,
                            genre:
                                movie.genreName ||
                                movie.genre ||
                                "",
                        }))
                        : [];

                setMovies(
                    formattedMovies
                );

            } catch (error) {

                console.error(
                    "Failed to load upcoming movies:",
                    error
                );

                setMovies([]);

                setLoadError(
                    "Unable to load upcoming movies. Please try again."
                );

            } finally {

                setLoading(false);

            }

        };

        loadMovies();

    }, []);

    const currentDate =
        new Date();

    const today =
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    const upcomingMovies =
        movies.filter((movie) => {

            if (!movie.releaseDate) {

                return (
                    movie.status?.toLowerCase() ===
                    "upcoming"
                );

            }

            const releaseDate =
                new Date(movie.releaseDate)
                    .toISOString()
                    .split("T")[0];

            return releaseDate > today;

        });

    if (loading) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading upcoming movies...
                    </p>

                </div>

            </div>
        );

    }

    if (loadError) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <FaFilm className="text-6xl text-base-content/30 mx-auto" />

                    <h2 className="text-2xl font-bold mt-4">
                        Unable to Load Upcoming Movies
                    </h2>

                    <p className="text-base-content/60 mt-2">
                        {loadError}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="btn btn-primary mt-6"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-7xl mx-auto">

                <Link
                    to="/"
                    className="btn btn-ghost mb-6"
                >

                    <FaArrowLeft />

                    Back to Home

                </Link>

                <div className="text-center mb-10">

                    <p className="text-primary font-semibold">
                        COMING SOON
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        Upcoming Movies
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        Discover movies that are coming soon to MovieBook.
                    </p>

                </div>

                {upcomingMovies.length > 0 ? (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {upcomingMovies.map(
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

                                                <FaFilm className="text-6xl text-base-content/30" />

                                            </div>

                                        )}

                                    </figure>

                                    <div className="card-body">

                                        <h2 className="card-title">
                                            {
                                                movie.title
                                            }
                                        </h2>

                                        {movie.genre && (

                                            <p className="text-sm text-base-content/60">

                                                {Array.isArray(
                                                    movie.genre
                                                )
                                                    ? movie.genre.join(
                                                        ", "
                                                    )
                                                    : movie.genre}

                                            </p>

                                        )}

                                        {movie.releaseDate && (

                                            <div className="flex items-center gap-2 text-sm mt-2">

                                                <FaCalendarAlt className="text-primary" />

                                                <span>
                                                    {
                                                        movie.releaseDate
                                                    }
                                                </span>

                                            </div>

                                        )}

                                        {movie.description && (

                                            <p className="text-sm text-base-content/60 mt-2 line-clamp-3">
                                                {
                                                    movie.description
                                                }
                                            </p>

                                        )}

                                        <div className="card-actions mt-4">

                                            <Link
                                                to={`/movies/${movie.movieID}`}
                                                className="btn btn-primary btn-sm w-full"
                                            >
                                                View Movie
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body text-center py-16">

                            <FaFilm className="text-6xl text-base-content/30 mx-auto" />

                            <h2 className="text-2xl font-bold mt-4">
                                No Upcoming Movies
                            </h2>

                            <p className="text-base-content/60 mt-2">
                                There are currently no upcoming movies available.
                            </p>

                            <Link
                                to="/movies"
                                className="btn btn-primary mt-6"
                            >
                                Browse Movies
                            </Link>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default UpcomingMovies;