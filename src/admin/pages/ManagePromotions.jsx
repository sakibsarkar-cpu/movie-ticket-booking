import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaPercentage,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

const emptyForm = {
    promotionCode: "",
    description: "",
    discountPercentage: "",
    movieScope: "all",
    applicableMovieIDs: [],
    applicableDay: "All Days",
    startDate: "",
    endDate: "",
    status: "Active",
};

function ManagePromotions() {
    const [movies, setMovies] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [moviesResponse, promotionsResponse] =
                    await Promise.all([
                        fetch(
                            "http://localhost:5000/api/movies"
                        ),
                        fetch(
                            "http://localhost:5000/api/promotions"
                        ),
                    ]);

                if (
                    !moviesResponse.ok ||
                    !promotionsResponse.ok
                ) {
                    throw new Error(
                        "Failed to load promotion data."
                    );
                }

                const moviesData =
                    await moviesResponse.json();

                const promotionsData =
                    await promotionsResponse.json();

                setMovies(moviesData);
                setPromotions(promotionsData);
            } catch (error) {
                console.error(
                    "Failed to load promotion data:",
                    error
                );

                alert(
                    error.message ||
                        "Failed to load promotion data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMovieScopeChange = (event) => {
        const value = event.target.value;

        setFormData({
            ...formData,
            movieScope: value,
            applicableMovieIDs:
                value === "all"
                    ? []
                    : formData.applicableMovieIDs,
        });
    };

    const handleMovieSelection = (movieID) => {
        const numericMovieID =
            Number(movieID);

        const isSelected =
            formData.applicableMovieIDs.includes(
                numericMovieID
            );

        const updatedMovieIDs =
            isSelected
                ? formData.applicableMovieIDs.filter(
                      (id) =>
                          Number(id) !==
                          numericMovieID
                  )
                : [
                      ...formData.applicableMovieIDs,
                      numericMovieID,
                  ];

        setFormData({
            ...formData,
            applicableMovieIDs:
                updatedMovieIDs,
        });
    };

    const handleSelectAllMovies = () => {
        setFormData({
            ...formData,
            applicableMovieIDs:
                movies.map(
                    (movie) =>
                        Number(movie.movieID)
                ),
        });
    };

    const handleClearSelectedMovies = () => {
        setFormData({
            ...formData,
            applicableMovieIDs: [],
        });
    };

    const handleAddPromotion = () => {
        setEditingPromotion(null);

        setFormData({
            ...emptyForm,
        });

        setShowForm(true);
    };

    const handleEditPromotion = (promotion) => {
        setEditingPromotion(
            promotion
        );

        setFormData({
            promotionCode:
                promotion.promotionCode,

            description:
                promotion.description,

            discountPercentage:
                promotion.discountPercentage,

            movieScope:
                promotion.movieScope ||
                (
                    promotion.applicableMovieIDs &&
                    promotion.applicableMovieIDs.length >
                        0
                        ? "selected"
                        : "all"
                ),

            applicableMovieIDs:
                Array.isArray(
                    promotion.applicableMovieIDs
                )
                    ? promotion.applicableMovieIDs.map(
                          (id) =>
                              Number(id)
                      )
                    : [],

            applicableDay:
                promotion.applicableDay ||
                "All Days",

            startDate:
                promotion.startDate,

            endDate:
                promotion.endDate,

            status:
                promotion.status,
        });

        setShowForm(true);
    };

    const handleDeletePromotion = async (
        promotionID
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this promotion?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/promotions/${promotionID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Promotion deletion failed."
                );
            }

            setPromotions(
                promotions.filter(
                    (promotion) =>
                        promotion.promotionID !==
                        promotionID
                )
            );

            alert(
                "Promotion deleted successfully."
            );
        } catch (error) {
            console.error(
                "Promotion deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Promotion deletion failed."
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const promotionCode =
            formData.promotionCode
                .trim()
                .toUpperCase();

        if (!promotionCode) {
            alert(
                "Please enter a promotion code."
            );

            return;
        }

        if (
            !formData.discountPercentage ||
            Number(
                formData.discountPercentage
            ) <= 0 ||
            Number(
                formData.discountPercentage
            ) > 100
        ) {
            alert(
                "Discount percentage must be between 1% and 100%."
            );

            return;
        }

        if (!formData.startDate) {
            alert(
                "Please select a start date."
            );

            return;
        }

        if (!formData.endDate) {
            alert(
                "Please select an end date."
            );

            return;
        }

        if (
            formData.endDate <
            formData.startDate
        ) {
            alert(
                "End date cannot be earlier than the start date."
            );

            return;
        }

        if (
            formData.movieScope ===
                "selected" &&
            formData.applicableMovieIDs.length ===
                0
        ) {
            alert(
                "Please select at least one movie."
            );

            return;
        }

        const duplicatePromotion =
            promotions.find(
                (promotion) =>
                    promotion.promotionCode ===
                        promotionCode &&
                    promotion.promotionID !==
                        editingPromotion?.promotionID
            );

        if (duplicatePromotion) {
            alert(
                "This promotion code already exists."
            );

            return;
        }

        const normalizedMovieIDs =
            formData.movieScope ===
                "selected"
                ? formData.applicableMovieIDs.map(
                      (id) =>
                          Number(id)
                  )
                : [];

        try {
            let response;

            if (editingPromotion) {
                response =
                    await fetch(
                        `http://localhost:5000/api/promotions/${editingPromotion.promotionID}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                promotionCode,
                                description:
                                    formData.description,
                                discountPercentage:
                                    Number(
                                        formData.discountPercentage
                                    ),
                                movieScope:
                                    formData.movieScope,
                                applicableMovieIDs:
                                    normalizedMovieIDs,
                                applicableDay:
                                    formData.applicableDay,
                                startDate:
                                    formData.startDate,
                                endDate:
                                    formData.endDate,
                                status:
                                    formData.status,
                            }),
                        }
                    );
            } else {
                const newPromotionID =
                    promotions.length > 0
                        ? Math.max(
                              ...promotions.map(
                                  (
                                      promotion
                                  ) =>
                                      Number(
                                          promotion.promotionID
                                      ) || 0
                              )
                          ) + 1
                        : 1;

                response =
                    await fetch(
                        "http://localhost:5000/api/promotions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                promotionID:
                                    newPromotionID,
                                promotionCode,
                                description:
                                    formData.description,
                                discountPercentage:
                                    Number(
                                        formData.discountPercentage
                                    ),
                                movieScope:
                                    formData.movieScope,
                                applicableMovieIDs:
                                    normalizedMovieIDs,
                                applicableDay:
                                    formData.applicableDay,
                                startDate:
                                    formData.startDate,
                                endDate:
                                    formData.endDate,
                                status:
                                    formData.status,
                            }),
                        }
                    );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Promotion operation failed."
                );
            }

            if (editingPromotion) {
                setPromotions(
                    promotions.map(
                        (promotion) =>
                            promotion.promotionID ===
                            editingPromotion.promotionID
                                ? data.promotion
                                : promotion
                    )
                );

                alert(
                    "Promotion updated successfully."
                );
            } else {
                setPromotions([
                    ...promotions,
                    data.promotion,
                ]);

                alert(
                    "Promotion added successfully."
                );
            }

            handleCancel();
        } catch (error) {
            console.error(
                "Promotion operation failed:",
                error
            );

            alert(
                error.message ||
                    "Promotion operation failed."
            );
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingPromotion(null);
        setFormData({
            ...emptyForm,
        });
    };

    const getMovieTitle = (movieID) => {
        const movie =
            movies.find(
                (item) =>
                    Number(
                        item.movieID
                    ) ===
                    Number(movieID)
            );

        return movie
            ? movie.title
            : "Unknown Movie";
    };

    const getApplicableMovieText =
        (promotion) => {
            if (
                promotion.movieScope !==
                "selected"
            ) {
                return "All Movies";
            }

            const movieIDs =
                Array.isArray(
                    promotion.applicableMovieIDs
                )
                    ? promotion.applicableMovieIDs
                    : [];

            if (
                movieIDs.length === 0
            ) {
                return "No Movies Selected";
            }

            const titles =
                movieIDs.map(
                    (movieID) =>
                        getMovieTitle(
                            movieID
                        )
                );

            if (titles.length <= 2) {
                return titles.join(
                    ", "
                );
            }

            return `${titles
                .slice(0, 2)
                .join(", ")} +${
                titles.length - 2
            } more`;
        };

    const isCurrentlyValid =
        (promotion) => {
            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            return (
                promotion.status ===
                    "Active" &&
                today >=
                    promotion.startDate &&
                today <=
                    promotion.endDate
            );
        };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading promotions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10">
            <div className="w-[95%] max-w-7xl mx-auto">
                <Link
                    to="/admin/dashboard"
                    className="btn btn-ghost btn-sm mb-6"
                >
                    <FaArrowLeft />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <FaPercentage className="text-2xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Promotions
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Create and manage movie booking promotions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddPromotion
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Promotion
                    </button>
                </div>

                {showForm && (
                    <div className="card bg-base-100 shadow-md mb-8">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold">
                                {editingPromotion
                                    ? "Edit Promotion"
                                    : "Add Promotion"}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Create a discount promotion for customers.
                            </p>

                            <div className="divider"></div>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Promotion Code
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="promotionCode"
                                        value={
                                            formData.promotionCode
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="FRIDAY20"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Description
                                        </span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="20% discount for Friday bookings."
                                        className="textarea textarea-bordered w-full"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Discount Percentage
                                        </span>
                                    </label>

                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="discountPercentage"
                                            value={
                                                formData.discountPercentage
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            min="1"
                                            max="100"
                                            placeholder="20"
                                            className="input input-bordered w-full rounded-r-none"
                                            required
                                        />

                                        <span className="bg-base-200 border border-base-300 px-4 flex items-center rounded-r-lg font-semibold">
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Movie Applicability
                                        </span>
                                    </label>

                                    <select
                                        value={
                                            formData.movieScope
                                        }
                                        onChange={
                                            handleMovieScopeChange
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="all">
                                            All Movies
                                        </option>

                                        <option value="selected">
                                            Selected Movies
                                        </option>
                                    </select>

                                    <label className="label">
                                        <span className="label-text-alt text-base-content/60">
                                            Choose whether this promotion applies to all movies or only selected movies.
                                        </span>
                                    </label>
                                </div>

                                {formData.movieScope ===
                                    "selected" && (
                                    <div className="mt-3 border border-base-300 rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                            <div>
                                                <p className="font-semibold">
                                                    Select Movies
                                                </p>

                                                <p className="text-sm text-base-content/60">
                                                    Select the movies that can use this promotion.
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleSelectAllMovies
                                                    }
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    Select All
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleClearSelectedMovies
                                                    }
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {movies.map(
                                                (
                                                    movie
                                                ) => {
                                                    const movieID =
                                                        Number(
                                                            movie.movieID
                                                        );

                                                    const checked =
                                                        formData.applicableMovieIDs.includes(
                                                            movieID
                                                        );

                                                    return (
                                                        <label
                                                            key={
                                                                movieID
                                                            }
                                                            className="flex items-center gap-3 border border-base-300 rounded-lg p-3 cursor-pointer hover:bg-base-200"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={() =>
                                                                    handleMovieSelection(
                                                                        movieID
                                                                    )
                                                                }
                                                                className="checkbox checkbox-primary"
                                                            />

                                                            <span className="font-medium">
                                                                {
                                                                    movie.title
                                                                }
                                                            </span>
                                                        </label>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <p className="text-sm text-primary font-semibold mt-4">
                                            {
                                                formData
                                                    .applicableMovieIDs
                                                    .length
                                            }{" "}
                                            movie
                                            {formData
                                                .applicableMovieIDs
                                                .length !==
                                            1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </p>
                                    </div>
                                )}

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Applicable Day
                                        </span>
                                    </label>

                                    <select
                                        name="applicableDay"
                                        value={
                                            formData.applicableDay
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="All Days">
                                            All Days
                                        </option>

                                        <option value="Monday">
                                            Monday
                                        </option>

                                        <option value="Tuesday">
                                            Tuesday
                                        </option>

                                        <option value="Wednesday">
                                            Wednesday
                                        </option>

                                        <option value="Thursday">
                                            Thursday
                                        </option>

                                        <option value="Friday">
                                            Friday
                                        </option>

                                        <option value="Saturday">
                                            Saturday
                                        </option>

                                        <option value="Sunday">
                                            Sunday
                                        </option>

                                        <option value="Saturday & Sunday">
                                            Saturday & Sunday
                                        </option>
                                    </select>

                                    <label className="label">
                                        <span className="label-text-alt text-base-content/60">
                                            The promotion will only work for bookings on the selected day.
                                        </span>
                                    </label>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                Start Date
                                            </span>
                                        </label>

                                        <input
                                            type="date"
                                            name="startDate"
                                            value={
                                                formData.startDate
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                End Date
                                            </span>
                                        </label>

                                        <input
                                            type="date"
                                            name="endDate"
                                            value={
                                                formData.endDate
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Status
                                        </span>
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {editingPromotion
                                            ? "Update Promotion"
                                            : "Add Promotion"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Promotion List
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Total Promotions:{" "}
                                {promotions.length}
                            </p>
                        </div>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>
                                            Promotion Code
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Discount
                                        </th>
                                        <th>
                                            Applicable Movies
                                        </th>
                                        <th>
                                            Applicable Day
                                        </th>
                                        <th>
                                            Start Date
                                        </th>
                                        <th>
                                            End Date
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {promotions.map(
                                        (
                                            promotion
                                        ) => (
                                            <tr
                                                key={
                                                    promotion.promotionID
                                                }
                                            >
                                                <td>
                                                    {
                                                        promotion.promotionID
                                                    }
                                                </td>

                                                <td>
                                                    <span className="badge badge-primary font-semibold">
                                                        {
                                                            promotion.promotionCode
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="text-sm">
                                                        {
                                                            promotion.description
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="font-semibold text-primary">
                                                        {
                                                            promotion.discountPercentage
                                                        }
                                                        %
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="text-sm font-semibold">
                                                        {getApplicableMovieText(
                                                            promotion
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="font-semibold">
                                                        {
                                                            promotion.applicableDay
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        promotion.startDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        promotion.endDate
                                                    }
                                                </td>

                                                <td>
                                                    <div className="flex flex-col gap-1">
                                                        <span
                                                            className={`badge ${
                                                                promotion.status ===
                                                                "Active"
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >
                                                            {
                                                                promotion.status
                                                            }
                                                        </span>

                                                        {isCurrentlyValid(
                                                            promotion
                                                        ) && (
                                                            <span className="text-xs text-success font-semibold">
                                                                Currently Valid
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditPromotion(
                                                                    promotion
                                                                )
                                                            }
                                                            className="btn btn-outline btn-primary btn-sm"
                                                        >
                                                            <FaEdit />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeletePromotion(
                                                                    promotion.promotionID
                                                                )
                                                            }
                                                            className="btn btn-outline btn-error btn-sm"
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

                        {promotions.length ===
                            0 && (
                            <div className="text-center py-10">
                                <FaPercentage className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Promotions
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a promotion to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddPromotion
                                    }
                                    className="btn btn-primary mt-4"
                                >
                                    <FaPlus />
                                    Add Promotion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagePromotions;