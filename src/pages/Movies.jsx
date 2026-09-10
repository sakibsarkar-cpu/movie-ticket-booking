import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaPlay } from "react-icons/fa";

function Movies() {

    const [movies, setMovies] =
        useState([]);

    const [searchText, setSearchText] =
        useState("");

    const [selectedGenre, setSelectedGenre] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState("");

    const [searchParams] =
        useSearchParams();

    const searchInputRef =
        useRef(null);

    useEffect(() => {

        const loadMovies = async () => {

            try {

                setLoading(true);
                setLoadError("");

                const response =
                    await fetch(
                        "http://localhost:5000/api/movies/active"
                    );

                if (!response.ok) {

                    const data =
                        await response.json();

                    throw new Error(
                        data.message ||
                        "Failed to fetch movies"
                    );

                }

                const data =
                    await response.json();

                const today =
                    new Date();

                const todayDate =
                    `${today.getFullYear()}-${String(
                        today.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        today.getDate()
                    ).padStart(2, "0")}`;

                const formattedMovies =
                    Array.isArray(data)
                        ? data
                            .filter((movie) => {

                                if (!movie.releaseDate) {
                                    return true;
                                }

                                return (
                                    movie.releaseDate <=
                                    todayDate
                                );

                            })
                            .map((movie) => ({
                                ...movie,
                                genre:
                                    movie.genreName ||
                                    ""
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

    useEffect(() => {

        const searchFromNavbar =
            searchParams.get("search");

        if (searchFromNavbar) {

            setSearchText(
                searchFromNavbar
            );

            setTimeout(() => {

                searchInputRef.current?.focus();

            }, 100);

        }

    }, [searchParams]);

    const genres = [
        "All",
        ...new Set(
            movies.map(
                (movie) => movie.genre
            )
        ),
    ];

    const filteredMovies =
        movies.filter((movie) => {

            const search =
                searchText
                    .toLowerCase()
                    .trim();

            const matchesSearch =
                movie.title
                    .toLowerCase()
                    .includes(search)

                ||

                movie.genre
                    .toLowerCase()
                    .includes(search)

                ||

                movie.language
                    .toLowerCase()
                    .includes(search);

            const matchesGenre =
                selectedGenre === "All" ||
                movie.genre === selectedGenre;

            return (
                matchesSearch &&
                matchesGenre
            );

        });

    if (loading) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading movies...
                    </p>

                </div>

            </div>
        );

    }

    if (loadError) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <FaSearch className="text-5xl mx-auto text-base-content/30" />

                    <h2 className="text-2xl font-bold mt-4">
                        Unable to Load Movies
                    </h2>

                    <p className="mt-2 text-base-content/60">
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

        <div className="min-h-screen bg-base-200">

            <section className="bg-base-100 py-12">

                <div className="w-[85%] mx-auto text-center">

                    <p className="text-primary font-semibold">
                        EXPLORE OUR COLLECTION
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-2">
                        Browse Movies
                    </h1>

                    <p className="mt-4 text-base-content/60 max-w-2xl mx-auto">
                        Discover movies, search by title or genre, and
                        choose the movie you want to watch.
                    </p>

                </div>

            </section>

            <section className="py-8">

                <div className="w-[85%] mx-auto">

                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="relative flex-1">

                            <FaSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
                            />

                            <input
                                ref={
                                    searchInputRef
                                }
                                type="text"
                                placeholder="Search movies, genre or language..."
                                value={
                                    searchText
                                }
                                onChange={(event) =>
                                    setSearchText(
                                        event.target.value
                                    )
                                }
                                className="input input-bordered w-full pl-11"
                            />

                        </div>

                        <select
                            value={
                                selectedGenre
                            }
                            onChange={(event) =>
                                setSelectedGenre(
                                    event.target.value
                                )
                            }
                            className="select select-bordered w-full md:w-52"
                        >

                            {genres.map(
                                (genre) => (

                                    <option
                                        key={genre}
                                        value={genre}
                                    >
                                        {genre}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>

            </section>

            <section className="pb-16">

                <div className="w-[85%] mx-auto">

                    {filteredMovies.length > 0 ? (

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                            {filteredMovies.map(
                                (movie) => (

                                    <div
                                        key={
                                            movie.movieID
                                        }
                                        className="card bg-base-100 shadow-md overflow-hidden"
                                    >

                                        <figure className="w-full h-93">

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

                                                <div className="flex items-center justify-center h-full w-full bg-base-100 text-base-content/40">
                                                    No Image
                                                </div>

                                            )}

                                        </figure>

                                        <div className="card-body">

                                            <div className="flex justify-between items-start gap-3">

                                                <h2 className="card-title">
                                                    {
                                                        movie.title
                                                    }
                                                </h2>

                                                <div className="badge badge-primary">
                                                    {
                                                        movie.genre
                                                    }
                                                </div>

                                            </div>

                                            <p className="text-sm text-base-content/70 line-clamp-3">
                                                {
                                                    movie.description
                                                }
                                            </p>

                                            <div className="text-sm text-base-content/60 space-y-1 mt-2">

                                                <p>
                                                    <strong>
                                                        Duration:
                                                    </strong>{" "}
                                                    {
                                                        movie.duration
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Language:
                                                    </strong>{" "}
                                                    {
                                                        movie.language
                                                    }
                                                </p>

                                                <p>
                                                    <strong>
                                                        Release:
                                                    </strong>{" "}
                                                    {
                                                        movie.releaseDate ||
                                                        "Not available"
                                                    }
                                                </p>

                                            </div>

                                            <div className="card-actions justify-end mt-4">

                                                <Link
                                                    to={`/movies/${movie.movieID}`}
                                                    className="btn btn-primary"
                                                >

                                                    <FaPlay />

                                                    View Details

                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="text-center py-20">

                            <FaSearch className="text-5xl mx-auto text-base-content/30" />

                            <h2 className="text-2xl font-bold mt-4">
                                No Movies Found
                            </h2>

                            <p className="mt-2 text-base-content/60">
                                Try another movie title, genre or language.
                            </p>

                        </div>

                    )}

                </div>

            </section>

        </div>

    );

}

export default Movies;