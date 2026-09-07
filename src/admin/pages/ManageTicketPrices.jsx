import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaMoneyBillWave,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function ManageTicketPrices() {
    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [screens, setScreens] = useState([]);
    const [ticketPrices, setTicketPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPrice, setEditingPrice] = useState(null);

    const [formData, setFormData] = useState({
        movieID: "",
        branchID: "",
        screenID: "",
        price: "",
        status: "Active",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [
                    movieResponse,
                    branchResponse,
                    screenResponse,
                    priceResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/movies"
                    ),
                    fetch(
                        "http://localhost:5000/api/branches"
                    ),
                    fetch(
                        "http://localhost:5000/api/screens"
                    ),
                    fetch(
                        "http://localhost:5000/api/ticket-prices"
                    ),
                ]);

                if (
                    !movieResponse.ok ||
                    !branchResponse.ok ||
                    !screenResponse.ok ||
                    !priceResponse.ok
                ) {
                    throw new Error(
                        "Failed to load ticket price data."
                    );
                }

                const movieData =
                    await movieResponse.json();

                const branchData =
                    await branchResponse.json();

                const screenData =
                    await screenResponse.json();

                const priceData =
                    await priceResponse.json();

                setMovies(movieData);
                setBranches(branchData);
                setScreens(screenData);
                setTicketPrices(priceData);

                if (
                    movieData.length > 0 &&
                    branchData.length > 0
                ) {
                    const branchScreens =
                        screenData.filter(
                            (screen) =>
                                Number(
                                    screen.branchID
                                ) ===
                                Number(
                                    branchData[0]
                                        .branchID
                                )
                        );

                    setFormData({
                        movieID:
                            movieData[0]
                                .movieID,
                        branchID:
                            branchData[0]
                                .branchID,
                        screenID:
                            branchScreens.length >
                            0
                                ? branchScreens[0]
                                      .screenID
                                : "",
                        price: "",
                        status: "Active",
                    });
                }
            } catch (error) {
                console.error(
                    "Failed to load ticket price data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const availableScreens =
        screens.filter(
            (screen) =>
                Number(screen.branchID) ===
                Number(formData.branchID)
        );

    const handleInputChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        if (name === "branchID") {
            const branchScreens =
                screens.filter(
                    (screen) =>
                        Number(
                            screen.branchID
                        ) ===
                        Number(value)
                );

            setFormData({
                ...formData,
                branchID: Number(value),
                screenID:
                    branchScreens.length >
                    0
                        ? branchScreens[0]
                              .screenID
                        : "",
            });

            return;
        }

        setFormData({
            ...formData,
            [name]:
                name === "movieID" ||
                name === "screenID"
                    ? Number(value)
                    : value,
        });
    };

    const handleAddPrice = () => {
        const firstBranch =
            branches.length > 0
                ? branches[0].branchID
                : "";

        const branchScreens =
            screens.filter(
                (screen) =>
                    Number(screen.branchID) ===
                    Number(firstBranch)
            );

        setEditingPrice(null);

        setFormData({
            movieID:
                movies.length > 0
                    ? movies[0].movieID
                    : "",
            branchID: firstBranch,
            screenID:
                branchScreens.length > 0
                    ? branchScreens[0]
                          .screenID
                    : "",
            price: "",
            status: "Active",
        });

        setShowForm(true);
    };

    const handleEditPrice = (
        ticketPrice
    ) => {
        setEditingPrice(ticketPrice);

        setFormData({
            movieID:
                ticketPrice.movieID,
            branchID:
                ticketPrice.branchID,
            screenID:
                ticketPrice.screenID,
            price:
                ticketPrice.price,
            status:
                ticketPrice.status,
        });

        setShowForm(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.price ||
            Number(formData.price) <= 0
        ) {
            alert(
                "Please enter a valid ticket price."
            );
            return;
        }

        if (!formData.movieID) {
            alert("Please select a movie.");
            return;
        }

        if (!formData.branchID) {
            alert(
                "Please select a cinema branch."
            );
            return;
        }

        if (!formData.screenID) {
            alert("Please select a screen.");
            return;
        }

        const duplicatePrice =
            ticketPrices.find(
                (ticketPrice) =>
                    Number(
                        ticketPrice.movieID
                    ) ===
                        Number(
                            formData.movieID
                        ) &&
                    Number(
                        ticketPrice.screenID
                    ) ===
                        Number(
                            formData.screenID
                        ) &&
                    Number(
                        ticketPrice.priceID
                    ) !==
                        Number(
                            editingPrice?.priceID
                        )
            );

        if (duplicatePrice) {
            alert(
                "A ticket price already exists for this movie and screen."
            );
            return;
        }

        const ticketPriceData = {
            priceID: editingPrice
                ? Number(
                      editingPrice.priceID
                  )
                : ticketPrices.length > 0
                ? Math.max(
                      ...ticketPrices.map(
                          (
                              ticketPrice
                          ) =>
                              Number(
                                  ticketPrice.priceID
                              ) || 0
                      )
                  ) + 1
                : 1,
            movieID:
                Number(formData.movieID),
            branchID:
                Number(formData.branchID),
            screenID:
                Number(formData.screenID),
            price:
                Number(formData.price),
            status:
                formData.status,
        };

        try {
            let response;

            if (editingPrice) {
                response =
                    await fetch(
                        `http://localhost:5000/api/ticket-prices/${editingPrice.priceID}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    ticketPriceData
                                ),
                        }
                    );
            } else {
                response =
                    await fetch(
                        "http://localhost:5000/api/ticket-prices",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    ticketPriceData
                                ),
                        }
                    );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Ticket price operation failed."
                );
            }

            if (editingPrice) {
                setTicketPrices(
                    ticketPrices.map(
                        (
                            ticketPrice
                        ) =>
                            Number(
                                ticketPrice.priceID
                            ) ===
                            Number(
                                editingPrice.priceID
                            )
                                ? data.ticketPrice
                                : ticketPrice
                    )
                );

                alert(
                    "Ticket price updated successfully."
                );
            } else {
                setTicketPrices([
                    ...ticketPrices,
                    data.ticketPrice,
                ]);

                alert(
                    "Ticket price added successfully."
                );
            }

            handleCancel();
        } catch (error) {
            console.error(
                "Ticket price operation failed:",
                error
            );

            alert(
                error.message ||
                    "Ticket price operation failed."
            );
        }
    };

    const handleDeletePrice = async (
        priceID
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this ticket price?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/ticket-prices/${priceID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Ticket price deletion failed."
                );
            }

            setTicketPrices(
                ticketPrices.filter(
                    (ticketPrice) =>
                        Number(
                            ticketPrice.priceID
                        ) !==
                        Number(priceID)
                )
            );

            alert(
                "Ticket price deleted successfully."
            );
        } catch (error) {
            console.error(
                "Ticket price deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Ticket price deletion failed."
            );
        }
    };

    const handleCancel = () => {
        const firstBranch =
            branches.length > 0
                ? branches[0].branchID
                : "";

        const branchScreens =
            screens.filter(
                (screen) =>
                    Number(screen.branchID) ===
                    Number(firstBranch)
            );

        setShowForm(false);
        setEditingPrice(null);

        setFormData({
            movieID:
                movies.length > 0
                    ? movies[0].movieID
                    : "",
            branchID: firstBranch,
            screenID:
                branchScreens.length > 0
                    ? branchScreens[0]
                          .screenID
                    : "",
            price: "",
            status: "Active",
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

    const getBranchName = (
        branchID
    ) => {
        const branch =
            branches.find(
                (item) =>
                    Number(
                        item.branchID
                    ) ===
                    Number(branchID)
            );

        return branch
            ? branch.branchName
            : "Unknown Branch";
    };

    const getScreenName = (
        screenID
    ) => {
        const screen =
            screens.find(
                (item) =>
                    Number(
                        item.screenID
                    ) ===
                    Number(screenID)
            );

        return screen
            ? screen.screenName
            : "Unknown Screen";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading ticket prices...
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
                                <FaMoneyBillWave className="text-2xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Ticket Prices
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Manage ticket pricing for movies and cinema screens.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddPrice
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Ticket Price
                    </button>
                </div>

                {showForm && (
                    <div className="card bg-base-100 shadow-md mb-8">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold">
                                {editingPrice
                                    ? "Edit Ticket Price"
                                    : "Add Ticket Price"}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Set the ticket price for a movie and cinema screen.
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
                                            Movie
                                        </span>
                                    </label>

                                    <select
                                        name="movieID"
                                        value={
                                            formData.movieID
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select Movie
                                        </option>

                                        {movies.map(
                                            (
                                                movie
                                            ) => (
                                                <option
                                                    key={
                                                        movie.movieID
                                                    }
                                                    value={
                                                        movie.movieID
                                                    }
                                                >
                                                    {
                                                        movie.title
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Cinema Branch
                                        </span>
                                    </label>

                                    <select
                                        name="branchID"
                                        value={
                                            formData.branchID
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select Branch
                                        </option>

                                        {branches.map(
                                            (
                                                branch
                                            ) => (
                                                <option
                                                    key={
                                                        branch.branchID
                                                    }
                                                    value={
                                                        branch.branchID
                                                    }
                                                >
                                                    {
                                                        branch.branchName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Screen
                                        </span>
                                    </label>

                                    <select
                                        name="screenID"
                                        value={
                                            formData.screenID
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">
                                            Select Screen
                                        </option>

                                        {availableScreens.map(
                                            (
                                                screen
                                            ) => (
                                                <option
                                                    key={
                                                        screen.screenID
                                                    }
                                                    value={
                                                        screen.screenID
                                                    }
                                                >
                                                    {
                                                        screen.screenName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Ticket Price
                                        </span>
                                    </label>

                                    <div className="flex">
                                        <span className="bg-base-200 border border-base-300 px-4 flex items-center rounded-l-lg">
                                            ৳
                                        </span>

                                        <input
                                            type="number"
                                            name="price"
                                            value={
                                                formData.price
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            min="1"
                                            placeholder="350"
                                            className="input input-bordered w-full rounded-l-none"
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
                                        {editingPrice
                                            ? "Update Price"
                                            : "Add Price"}
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
                                Ticket Price List
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Total Pricing Records:{" "}
                                {
                                    ticketPrices.length
                                }
                            </p>
                        </div>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Movie
                                        </th>

                                        <th>
                                            Cinema Branch
                                        </th>

                                        <th>
                                            Screen
                                        </th>

                                        <th>
                                            Ticket Price
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
                                    {ticketPrices.map(
                                        (
                                            ticketPrice
                                        ) => (
                                            <tr
                                                key={
                                                    ticketPrice.priceID
                                                }
                                            >
                                                <td>
                                                    {
                                                        ticketPrice.priceID
                                                    }
                                                </td>

                                                <td>
                                                    <span className="font-semibold">
                                                        {getMovieTitle(
                                                            ticketPrice.movieID
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    {getBranchName(
                                                        ticketPrice.branchID
                                                    )}
                                                </td>

                                                <td>
                                                    {getScreenName(
                                                        ticketPrice.screenID
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="font-semibold text-primary">
                                                        ৳
                                                        {
                                                            ticketPrice.price
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            ticketPrice.status ===
                                                            "Active"
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {
                                                            ticketPrice.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditPrice(
                                                                    ticketPrice
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
                                                                handleDeletePrice(
                                                                    ticketPrice.priceID
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

                        {ticketPrices.length ===
                            0 && (
                            <div className="text-center py-10">
                                <FaMoneyBillWave className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Ticket Prices
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a ticket price to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddPrice
                                    }
                                    className="btn btn-primary mt-4"
                                >
                                    <FaPlus />
                                    Add Ticket Price
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageTicketPrices;