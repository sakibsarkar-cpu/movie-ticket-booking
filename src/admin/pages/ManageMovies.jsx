import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaPlus,
    FaEdit,
    FaTrash,
    FaFilm,
    FaTimes,
} from "react-icons/fa";

import avatar from "../../assets/posters/avatar.jpg";
import avengersEndgame from "../../assets/posters/avengers-endgame.jpg";
import darkKnight from "../../assets/posters/dark-knight.jpg";
import inception from "../../assets/posters/inception.jpg";
import insidious from "../../assets/posters/insidious.jpg";
import interstellar from "../../assets/posters/interstellar.jpg";
import johnWick from "../../assets/posters/john-wick.jpg";
import matrix from "../../assets/posters/matrix.jpg";
import parasite from "../../assets/posters/parasite.jpg";
import surongo from "../../assets/posters/surongo.jpg";
import theParadise from "../../assets/posters/the-paradise.jpg";

function ManageMovies() {
    const posterOptions = [
        {
            name: "Avatar",
            file: "avatar.jpg",
            image: avatar,
        },
        {
            name: "Avengers: Endgame",
            file: "avengers-endgame.jpg",
            image: avengersEndgame,
        },
        {
            name: "The Dark Knight",
            file: "dark-knight.jpg",
            image: darkKnight,
        },
        {
            name: "Inception",
            file: "inception.jpg",
            image: inception,
        },
        {
            name: "Insidious: Out of the Further",
            file: "insidious.jpg",
            image: insidious,
        },
        {
            name: "Interstellar",
            file: "interstellar.jpg",
            image: interstellar,
        },
        {
            name: "John Wick",
            file: "john-wick.jpg",
            image: johnWick,
        },
        {
            name: "The Matrix",
            file: "matrix.jpg",
            image: matrix,
        },
        {
            name: "Parasite",
            file: "parasite.jpg",
            image: parasite,
        },
        {
            name: "Surongo",
            file: "surongo.jpg",
            image: surongo,
        },
        {
            name: "The Paradise",
            file: "the-paradise.jpg",
            image: theParadise,
        },
    ];

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [deleteMovie, setDeleteMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        genreID: "",
        language: "",
        rating: "",
        duration: "",
        releaseDate: "",
        image: "",
        description: "",
        status: "active",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

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

                if (
                    !movieResponse.ok ||
                    !genreResponse.ok
                ) {
                    throw new Error(
                        "Failed to load movie data."
                    );
                }

                const movieData =
                    await movieResponse.json();

                const genreData =
                    await genreResponse.json();

                setMovies(movieData);
                setGenres(genreData);
            } catch (error) {
                console.error(
                    "Failed to load movie data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getPoster = (fileName) => {
        const poster =
            posterOptions.find(
                (poster) =>
                    poster.file === fileName
            );

        return poster
            ? poster.image
            : "";
    };

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddMovie = () => {
        setEditingMovie(null);

        setFormData({
            title: "",
            genreID:
                genres.length > 0
                    ? String(
                          genres[0].genreID
                      )
                    : "",
            language: "",
            rating: "",
            duration: "",
            releaseDate: "",
            image: "",
            description: "",
            status: "active",
        });

        setShowForm(true);
    };

    const handleEditMovie = (movie) => {
        setEditingMovie(movie);

        setFormData({
            title: movie.title || "",
            genreID:
                movie.genreID !== undefined
                    ? String(movie.genreID)
                    : "",
            language:
                movie.language || "",
            rating:
                movie.rating !== undefined &&
                movie.rating !== null
                    ? String(movie.rating)
                    : "",
            duration:
                movie.duration || "",
            releaseDate:
                movie.releaseDate || "",
            image:
                movie.image || "",
            description:
                movie.description || "",
            status:
                movie.status || "active",
        });

        setShowForm(true);
    };

    const validateMovie = () => {
        if (!formData.title.trim()) {
            alert(
                "Please enter movie title."
            );
            return false;
        }

        if (!formData.genreID) {
            alert(
                "Please select movie genre."
            );
            return false;
        }

        if (!formData.language.trim()) {
            alert(
                "Please enter movie language."
            );
            return false;
        }

        if (
            formData.rating === "" ||
            Number(formData.rating) < 0 ||
            Number(formData.rating) > 10
        ) {
            alert(
                "Please enter a valid movie rating between 0 and 10."
            );
            return false;
        }

        if (!formData.duration.trim()) {
            alert(
                "Please enter movie duration."
            );
            return false;
        }

        if (!formData.releaseDate) {
            alert(
                "Please select release date."
            );
            return false;
        }

        if (!formData.image) {
            alert(
                "Please select a movie poster."
            );
            return false;
        }

        if (!formData.description.trim()) {
            alert(
                "Please enter movie description."
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateMovie()) {
            return;
        }

        const selectedGenre =
            genres.find(
                (genre) =>
                    Number(
                        genre.genreID
                    ) ===
                    Number(
                        formData.genreID
                    )
            );

        if (!selectedGenre) {
            alert(
                "Selected genre could not be found."
            );
            return;
        }

        const movieData = {
            movieID: editingMovie
                ? Number(
                      editingMovie.movieID
                  )
                : movies.length > 0
                ? Math.max(
                      ...movies.map(
                          (movie) =>
                              Number(
                                  movie.movieID
                              ) || 0
                      )
                  ) + 1
                : 1,
            title:
                formData.title.trim(),
            genreID:
                Number(
                    selectedGenre.genreID
                ),
            genreName:
                selectedGenre.genreName,
            language:
                formData.language.trim(),
            rating:
                Number(formData.rating),
            duration:
                formData.duration.trim(),
            releaseDate:
                formData.releaseDate,
            image:
                formData.image,
            description:
                formData.description.trim(),
            status:
                formData.status ===
                "active"
                    ? "active"
                    : "inactive",
        };

        try {
            let response;

            if (editingMovie) {
                response =
                    await fetch(
                        `http://localhost:5000/api/movies/${editingMovie.movieID}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    movieData
                                ),
                        }
                    );
            } else {
                response =
                    await fetch(
                        "http://localhost:5000/api/movies",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    movieData
                                ),
                        }
                    );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Movie operation failed."
                );
            }

            if (editingMovie) {
                setMovies(
                    movies.map(
                        (movie) =>
                            Number(
                                movie.movieID
                            ) ===
                            Number(
                                editingMovie.movieID
                            )
                                ? data.movie
                                : movie
                    )
                );

                alert(
                    "Movie information updated successfully."
                );
            } else {
                setMovies([
                    ...movies,
                    data.movie,
                ]);

                alert(
                    "Movie added successfully."
                );
            }

            handleCancel();
        } catch (error) {
            console.error(
                "Movie operation failed:",
                error
            );

            alert(
                error.message ||
                    "Movie operation failed."
            );
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingMovie(null);

        setFormData({
            title: "",
            genreID: "",
            language: "",
            rating: "",
            duration: "",
            releaseDate: "",
            image: "",
            description: "",
            status: "active",
        });
    };

    const handleDeleteClick = (movie) => {
        setDeleteMovie(movie);
    };

    const handleConfirmDelete = async () => {
        if (!deleteMovie) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/movies/${deleteMovie.movieID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Movie deletion failed."
                );
            }

            setMovies(
                movies.filter(
                    (movie) =>
                        Number(
                            movie.movieID
                        ) !==
                        Number(
                            deleteMovie.movieID
                        )
                )
            );

            alert(
                "Movie deleted successfully."
            );

            setDeleteMovie(null);
        } catch (error) {
            console.error(
                "Movie deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Movie deletion failed."
            );
        }
    };

    const handleCancelDelete = () => {
        setDeleteMovie(null);
    };

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

    return (
        <div className="min-h-screen bg-base-200 py-10">
            <div className="w-[90%] max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <Link
                            to="/admin/dashboard"
                            className="btn btn-ghost btn-sm mb-4"
                        >
                            <FaArrowLeft />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FaFilm className="text-primary text-xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Movies
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Add, edit and delete movies.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddMovie
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Movie
                    </button>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Movie List
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Total Movies:{" "}
                                {movies.length}
                            </p>
                        </div>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Movie</th>
                                        <th>Genre</th>
                                        <th>Language</th>
                                        <th>Rating</th>
                                        <th>Duration</th>
                                        <th>Release Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {movies.map(
                                        (
                                            movie
                                        ) => (
                                            <tr
                                                key={
                                                    movie.movieID
                                                }
                                            >
                                                <td>
                                                    <span className="font-semibold">
                                                        {
                                                            movie.movieID
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        {getPoster(
                                                            movie.image
                                                        ) ? (
                                                            <img
                                                                src={getPoster(
                                                                    movie.image
                                                                )}
                                                                alt={
                                                                    movie.title
                                                                }
                                                                className="w-12 h-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-16 bg-base-200 rounded flex items-center justify-center">
                                                                <FaFilm className="text-base-content/30" />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="font-bold">
                                                                {
                                                                    movie.title
                                                                }
                                                            </p>

                                                            <p className="text-xs text-base-content/60 max-w-xs">
                                                                {
                                                                    movie.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="badge badge-primary badge-outline">
                                                        {
                                                            movie.genreName
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        movie.language
                                                    }
                                                </td>

                                                <td>
                                                    ⭐{" "}
                                                    {movie.rating ??
                                                        "N/A"}
                                                </td>

                                                <td>
                                                    {
                                                        movie.duration
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        movie.releaseDate ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            movie.status ===
                                                            "active"
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {movie.status ===
                                                        "active"
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditMovie(
                                                                    movie
                                                                )
                                                            }
                                                            className="btn btn-sm btn-outline btn-primary"
                                                        >
                                                            <FaEdit />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    movie
                                                                )
                                                            }
                                                            className="btn btn-sm btn-outline btn-error"
                                                        >
                                                            <FaTrash />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {movies.length ===
                            0 && (
                            <div className="text-center py-12">
                                <FaFilm className="text-5xl text-base-content/20 mx-auto mb-4" />

                                <h3 className="text-xl font-bold">
                                    No Movies Found
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a movie to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {editingMovie
                                            ? "Edit Movie"
                                            : "Add Movie"}
                                    </h2>

                                    <p className="text-sm text-base-content/60 mt-1">
                                        {editingMovie
                                            ? "Edit movie information and save changes."
                                            : "Enter movie information to add a new movie."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="divider"></div>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Movie Title
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter movie title"
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Genre
                                            </span>
                                        </label>

                                        <select
                                            name="genreID"
                                            value={
                                                formData.genreID
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">
                                                Select Genre
                                            </option>

                                            {genres.map(
                                                (
                                                    genre
                                                ) => (
                                                    <option
                                                        key={
                                                            genre.genreID
                                                        }
                                                        value={
                                                            genre.genreID
                                                        }
                                                    >
                                                        {
                                                            genre.genreName
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Language
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="language"
                                            value={
                                                formData.language
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. English"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Rating
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            name="rating"
                                            value={
                                                formData.rating
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 8.8"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            className="input input-bordered w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Duration
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="duration"
                                            value={
                                                formData.duration
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 2h 28m"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Release Date
                                        </span>
                                    </label>

                                    <input
                                        type="date"
                                        name="releaseDate"
                                        value={
                                            formData.releaseDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Movie Poster
                                        </span>
                                    </label>

                                    <select
                                        name="image"
                                        value={
                                            formData.image
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">
                                            Select Movie Poster
                                        </option>

                                        {posterOptions.map(
                                            (
                                                poster
                                            ) => (
                                                <option
                                                    key={
                                                        poster.file
                                                    }
                                                    value={
                                                        poster.file
                                                    }
                                                >
                                                    {
                                                        poster.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {formData.image &&
                                        getPoster(
                                            formData.image
                                        ) && (
                                            <div className="mt-4 flex items-center gap-4">
                                                <img
                                                    src={getPoster(
                                                        formData.image
                                                    )}
                                                    alt="Selected movie poster"
                                                    className="w-20 h-28 object-cover rounded-lg shadow"
                                                />

                                                <div>
                                                    <p className="font-semibold">
                                                        Selected Poster
                                                    </p>

                                                    <p className="text-sm text-base-content/60">
                                                        {
                                                            formData.image
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="mt-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Description
                                        </span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter movie description"
                                        className="textarea textarea-bordered w-full h-28"
                                    ></textarea>
                                </div>

                                <div className="mt-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Status
                                        </span>
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        className="btn btn-outline flex-1"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                    >
                                        {editingMovie
                                            ? "Save Changes"
                                            : "Save Movie"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteMovie && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
                                    <FaTrash className="text-error text-2xl" />
                                </div>

                                <h2 className="text-2xl font-bold mt-4">
                                    Confirm Deletion
                                </h2>

                                <p className="text-base-content/60 mt-3">
                                    Are you sure you want to delete
                                    <span className="font-bold text-base-content">
                                        {" "}
                                        {
                                            deleteMovie.title
                                        }
                                    </span>
                                    ?
                                </p>

                                <p className="text-sm text-error mt-2">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={
                                        handleCancelDelete
                                    }
                                    className="btn btn-outline flex-1"
                                >
                                    No, Keep Movie
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmDelete
                                    }
                                    className="btn btn-error flex-1"
                                >
                                    <FaTrash />
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageMovies;