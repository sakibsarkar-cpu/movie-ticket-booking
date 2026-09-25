import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaFilm,
    FaStar,
} from "react-icons/fa";
import { getPoster } from "../utils/posterImages";

function Home() {

    const [movies, setMovies] =
        useState([]);

    const [currentMovie, setCurrentMovie] =
        useState(0);

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
                    "Failed to load movies:",
                    error
                );

                setMovies([]);

                setLoadError(
                    "Unable to load movies. Please try again."
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

    const nowShowingMovies =
        movies.filter((movie) => {

            if (!movie.releaseDate) {
                return false;
            }

            const releaseDate =
                new Date(movie.releaseDate)
                    .toISOString()
                    .split("T")[0];

            return releaseDate <= today;

        });

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

    useEffect(() => {

        if (nowShowingMovies.length <= 1) {
            return;
        }

        const interval =
            setInterval(() => {

                setCurrentMovie(
                    (previous) =>
                        (previous + 1) %
                        nowShowingMovies.length
                );

            }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, [nowShowingMovies.length]);

    useEffect(() => {

        if (
            currentMovie >=
            nowShowingMovies.length
        ) {

            setCurrentMovie(0);

        }

    }, [
        currentMovie,
        nowShowingMovies.length,
    ]);

    const goToPreviousMovie = () => {

        if (nowShowingMovies.length === 0) {
            return;
        }

        setCurrentMovie(
            (previous) =>
                previous === 0
                    ? nowShowingMovies.length - 1
                    : previous - 1
        );

    };

    const goToNextMovie = () => {

        if (nowShowingMovies.length === 0) {
            return;
        }

        setCurrentMovie(
            (previous) =>
                (previous + 1) %
                nowShowingMovies.length
        );

    };

    const activeMovie =
        nowShowingMovies[currentMovie];

    return (

        <div className="bg-base-100">

            {loading ? (

                <div className="min-h-[600px] flex items-center justify-center">

                    <div className="text-center">

                        <span className="loading loading-spinner loading-lg text-primary"></span>

                        <p className="mt-4 text-base-content/60">
                            Loading movies...
                        </p>

                    </div>

                </div>

            ) : loadError ? (

                <div className="min-h-[600px] flex items-center justify-center">

                    <div className="text-center">

                        <FaFilm className="text-6xl text-base-content/30 mx-auto" />

                        <h2 className="text-2xl font-bold mt-4">
                            Unable to Load Movies
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

            ) : (

                <>

                    {activeMovie && (

                        <section className="bg-neutral text-white">

                            <div className="w-[90%] max-w-7xl mx-auto min-h-[500px] flex items-center">

                                <div className="w-full grid md:grid-cols-2 gap-10 items-center py-10">

                                    <div className="max-w-xl">

                                        <p className="text-primary font-semibold tracking-wide mb-3">
                                            NOW SHOWING
                                        </p>

                                        <h1 className="text-5xl md:text-6xl font-bold">
                                            {activeMovie.title}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-4 mt-5 text-white/80">

                                            {activeMovie.genre && (

                                                <span>
                                                    {Array.isArray(
                                                        activeMovie.genre
                                                    )
                                                        ? activeMovie.genre.join(
                                                            ", "
                                                        )
                                                        : activeMovie.genre}
                                                </span>

                                            )}

                                            {activeMovie.language && (

                                                <span>
                                                    {activeMovie.language}
                                                </span>

                                            )}

                                            {activeMovie.rating && (

                                                <span className="flex items-center gap-2">

                                                    <FaStar className="text-yellow-400" />

                                                    {activeMovie.rating}

                                                </span>

                                            )}

                                            {activeMovie.duration && (

                                                <span>
                                                    {activeMovie.duration}
                                                </span>

                                            )}

                                        </div>

                                        {activeMovie.description && (

                                            <p className="mt-6 text-white/75 text-lg leading-relaxed max-w-xl line-clamp-3">
                                                {activeMovie.description}
                                            </p>

                                        )}

                                        <div className="flex flex-wrap gap-4 mt-8">

                                            <Link
                                                to={`/movies/${activeMovie.movieID}`}
                                                className="btn btn-primary btn-lg"
                                            >
                                                Book Tickets
                                            </Link>

                                            <Link
                                                to={`/movies/${activeMovie.movieID}`}
                                                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black"
                                            >
                                                View Movie
                                            </Link>

                                        </div>

                                    </div>

                                    <div className="flex justify-center md:justify-end">

                                        <img
                                            src={getPoster(
                                                activeMovie.image
                                            )}
                                            alt={
                                                activeMovie.title
                                            }
                                            className="w-64 md:w-72 h-[380px] md:h-[430px] object-cover rounded-xl shadow-2xl"
                                        />

                                    </div>

                                </div>

                            </div>

                            {nowShowingMovies.length > 1 && (

                                <div className="flex justify-center items-center gap-3 pb-7">

                                    <button
                                        type="button"
                                        onClick={
                                            goToPreviousMovie
                                        }
                                        className="btn btn-circle btn-sm btn-outline text-white border-white hover:bg-white hover:text-black"
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    {nowShowingMovies.map(
                                        (movie, index) => (

                                            <button
                                                key={
                                                    movie.movieID
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setCurrentMovie(
                                                        index
                                                    )
                                                }
                                                className={`h-3 rounded-full transition-all ${
                                                    index ===
                                                    currentMovie
                                                        ? "w-8 bg-primary"
                                                        : "w-3 bg-white/50"
                                                }`}
                                            />

                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={
                                            goToNextMovie
                                        }
                                        className="btn btn-circle btn-sm btn-outline text-white border-white hover:bg-white hover:text-black"
                                    >
                                        <FaChevronRight />
                                    </button>

                                </div>

                            )}

                        </section>

                    )}

                    <section className="py-14">

                        <div className="w-[90%] max-w-7xl mx-auto">

                            <div className="flex items-end justify-between mb-7">

                                <div>

                                    <p className="text-primary font-semibold">
                                        NOW SHOWING
                                    </p>

                                    <h2 className="text-3xl font-bold mt-1">
                                        Now Showing
                                    </h2>

                                    <p className="text-base-content/60 mt-2">
                                        Catch the latest movies currently running in theatres.
                                    </p>

                                </div>

                                <Link
                                    to="/movies"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    View All →
                                </Link>

                            </div>

                            {nowShowingMovies.length > 0 ? (

                               <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

                                    {nowShowingMovies
                                        .slice(0, 6)
                                        .map(
                                            (movie) => (

                                                <Link
                                                    key={
                                                        movie.movieID
                                                    }
                                                    to={`/movies/${movie.movieID}`}
                                                    className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
                                                >

                                                    <figure className="h-64">

                                                        {movie.image ? (

                                                            <img
                                                                src={
                                                                    getPoster(
                                                                        movie.image
                                                                    )
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

                                                    <div className="card-body p-4">

                                                        <h3 className="font-bold truncate">
                                                            {
                                                                movie.title
                                                            }
                                                        </h3>

                                                        {movie.genre && (

                                                            <p className="text-sm text-base-content/60 truncate">
                                                                {Array.isArray(
                                                                    movie.genre
                                                                )
                                                                    ? movie.genre.join(
                                                                        ", "
                                                                    )
                                                                    : movie.genre}
                                                            </p>

                                                        )}

                                                        {movie.rating && (

                                                            <div className="flex items-center gap-2 text-sm mt-1">

                                                                <FaStar className="text-yellow-400" />

                                                                <span>
                                                                    {
                                                                        movie.rating
                                                                    }
                                                                </span>

                                                            </div>

                                                        )}

                                                    </div>

                                                </Link>

                                            )
                                        )}

                                </div>

                            ) : (

                                <div className="text-center py-12">

                                    <FaFilm className="text-5xl text-base-content/30 mx-auto" />

                                    <p className="text-base-content/60 mt-4">
                                        No movies are currently showing.
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                    <section className="py-14 bg-base-200">

                        <div className="w-[90%] max-w-7xl mx-auto">

                            <div className="flex items-end justify-between mb-7">

                                <div>

                                    <p className="text-primary font-semibold">
                                        COMING SOON
                                    </p>

                                    <h2 className="text-3xl font-bold mt-1">
                                        Upcoming Movies
                                    </h2>

                                    <p className="text-base-content/60 mt-2">
                                        Get ready for the exciting upcoming releases.
                                    </p>

                                </div>

                                <Link
                                    to="/upcoming"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    View All →
                                </Link>

                            </div>

                            {upcomingMovies.length > 0 ? (

                                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

                                    {upcomingMovies
                                        .slice(0, 6)
                                        .map(
                                            (movie) => (

                                                <Link
                                                    key={
                                                        movie.movieID
                                                    }
                                                    to={`/movies/${movie.movieID}`}
                                                    className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
                                                >

                                                    <figure className="h-64">

                                                        {movie.image ? (

                                                            <img
                                                                src={
                                                                    getPoster(
                                                                        movie.image
                                                                    )
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

                                                    <div className="card-body p-4">

                                                        <h3 className="font-bold truncate">
                                                            {
                                                                movie.title
                                                            }
                                                        </h3>

                                                        {movie.genre && (

                                                            <p className="text-sm text-base-content/60 truncate">
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

                                                    </div>

                                                </Link>

                                            )
                                        )}

                                </div>

                            ) : (

                                <div className="text-center py-12">

                                    <FaFilm className="text-5xl text-base-content/30 mx-auto" />

                                    <p className="text-base-content/60 mt-4">
                                        No upcoming movies available.
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                    <footer className="bg-neutral  text-neutral-content">

                        <div className="w-[90%] max-w-7xl mx-auto py-12">

                            <div className="grid md:grid-cols-3 gap-10">

                                <div>

                                    <h2 className="text-2xl font-bold text-primary">
                                        MovieBook
                                    </h2>

                                    <p className="mt-3 text-neutral-content/70 max-w-sm">
                                        Your smarter way to discover movies,
                                        choose your seat, and book movie tickets.
                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold text-lg">
                                        Quick Links
                                    </h3>

                                    <div className="flex flex-col gap-2 mt-4">

                                        <Link
                                            to="/"
                                            className="hover:text-primary"
                                        >
                                            Home
                                        </Link>

                                        <Link
                                            to="/movies"
                                            className="hover:text-primary"
                                        >
                                            Movies
                                        </Link>

                                        <Link
                                            to="/upcoming"
                                            className="hover:text-primary"
                                        >
                                            Upcoming Movies
                                        </Link>

                                        <Link
                                            to="/ai-recommendations"
                                            className="hover:text-primary"
                                        >
                                            AI Recommendations
                                        </Link>

                                        <Link
                                            to="/ai-chatbot"
                                            className="hover:text-primary"
                                        >
                                            AI Assistant
                                        </Link>

                                        <Link
                                            to="/my-bookings"
                                            className="hover:text-primary"
                                        >
                                            My Bookings
                                        </Link>

                                    </div>

                                </div>

                                <div>

                                    <h3 className="font-bold text-lg">
                                        MovieBook
                                    </h3>

                                    <p className="mt-4 text-neutral-content/70">
                                        Enjoy a simple and convenient movie
                                        ticket booking experience.
                                    </p>

                                    <Link
                                        to="/movies"
                                        className="btn btn-primary mt-5"
                                    >
                                        Explore Movies
                                    </Link>

                                </div>

                            </div>

                            <div className="border-t border-neutral-content/20 mt-10 pt-5 flex flex-col md:flex-row justify-between gap-3 text-sm text-neutral-content/60">

                                <p>
                                    © 2026 MovieBook. All rights reserved.
                                </p>

                                <p>
                                    Made for movie lovers.
                                </p>

                            </div>

                        </div>

                    </footer>

                </>

            )}

        </div>

    );

}

export default Home;