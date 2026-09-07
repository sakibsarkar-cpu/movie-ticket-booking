import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTags,
    FaTimes,
} from "react-icons/fa";

function ManageGenres() {
    const [genres, setGenres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [deleteGenre, setDeleteGenre] = useState(null);
    const [genreName, setGenreName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "http://localhost:5000/api/genres"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load genres."
                    );
                }

                const data = await response.json();

                setGenres(data);
            } catch (error) {
                console.error(
                    "Failed to load genres:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadGenres();
    }, []);

    const handleAddGenre = () => {
        setEditingGenre(null);
        setGenreName("");
        setShowForm(true);
    };

    const handleEditGenre = (genre) => {
        setEditingGenre(genre);
        setGenreName(genre.genreName);
        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedGenreName =
            genreName.trim();

        if (!trimmedGenreName) {
            alert("Please enter genre name.");
            return;
        }

        const duplicateGenre =
            genres.find(
                (genre) =>
                    genre.genreName
                        .toLowerCase() ===
                        trimmedGenreName.toLowerCase() &&
                    genre.genreID !==
                        editingGenre?.genreID
            );

        if (duplicateGenre) {
            alert(
                "This genre already exists."
            );
            return;
        }

        try {
            let response;

            if (editingGenre) {
                response = await fetch(
                    `http://localhost:5000/api/genres/${editingGenre.genreID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            genreName:
                                trimmedGenreName,
                        }),
                    }
                );
            } else {
                const newGenreID =
                    genres.length > 0
                        ? Math.max(
                              ...genres.map(
                                  (genre) =>
                                      Number(
                                          genre.genreID
                                      ) || 0
                              )
                          ) + 1
                        : 1;

                response = await fetch(
                    "http://localhost:5000/api/genres",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            genreID:
                                newGenreID,
                            genreName:
                                trimmedGenreName,
                        }),
                    }
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Genre operation failed."
                );
            }

            if (editingGenre) {
                setGenres(
                    genres.map(
                        (genre) =>
                            genre.genreID ===
                            editingGenre.genreID
                                ? data.genre
                                : genre
                    )
                );

                alert(
                    "Genre information updated successfully."
                );
            } else {
                setGenres([
                    ...genres,
                    data.genre,
                ]);

                alert(
                    "Genre added successfully."
                );
            }

            handleCancel();
        } catch (error) {
            console.error(
                "Genre operation failed:",
                error
            );

            alert(
                error.message ||
                    "Genre operation failed."
            );
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingGenre(null);
        setGenreName("");
    };

    const handleDeleteClick = (genre) => {
        setDeleteGenre(genre);
    };

    const handleConfirmDelete = async () => {
        if (!deleteGenre) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/genres/${deleteGenre.genreID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Genre deletion failed."
                );
            }

            setGenres(
                genres.filter(
                    (genre) =>
                        genre.genreID !==
                        deleteGenre.genreID
                )
            );

            alert(
                "Genre deleted successfully."
            );

            setDeleteGenre(null);
        } catch (error) {
            console.error(
                "Genre deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Genre deletion failed."
            );
        }
    };

    const handleCancelDelete = () => {
        setDeleteGenre(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading genres...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10">
            <div className="w-[90%] max-w-6xl mx-auto">
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
                                <FaTags className="text-primary text-xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Genres
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Add, edit and delete movie genres.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddGenre
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Genre
                    </button>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Genre List
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Total Genres:{" "}
                                {genres.length}
                            </p>
                        </div>

                        <div className="divider"></div>

                        {genres.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Genre Name
                                            </th>

                                            <th>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {genres.map(
                                            (
                                                genre
                                            ) => (
                                                <tr
                                                    key={
                                                        genre.genreID
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            genre.genreID
                                                        }
                                                    </td>

                                                    <td>
                                                        <span className="badge badge-primary badge-outline">
                                                            {
                                                                genre.genreName
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditGenre(
                                                                        genre
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
                                                                        genre
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
                        ) : (
                            <div className="text-center py-12">
                                <FaTags className="text-5xl text-base-content/20 mx-auto mb-4" />

                                <h3 className="text-xl font-bold">
                                    No Genres Found
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a genre to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {editingGenre
                                            ? "Edit Genre"
                                            : "Add Genre"}
                                    </h2>

                                    <p className="text-sm text-base-content/60 mt-1">
                                        {editingGenre
                                            ? "Edit genre information and save changes."
                                            : "Enter genre information to add a new genre."}
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
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Genre Name
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        genreName
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setGenreName(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter genre name"
                                    className="input input-bordered w-full"
                                />

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
                                        {editingGenre
                                            ? "Save Changes"
                                            : "Save Genre"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteGenre && (
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
                                            deleteGenre.genreName
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
                                    No, Keep Genre
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

export default ManageGenres;