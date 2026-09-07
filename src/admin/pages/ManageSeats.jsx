import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaChair,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function ManageSeats() {
    const [branches, setBranches] = useState([]);
    const [screens, setScreens] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectedScreenID, setSelectedScreenID] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingSeat, setEditingSeat] = useState(null);
    const [formData, setFormData] = useState({
        seatNumber: "",
        status: "Available",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [
                    branchResponse,
                    screenResponse,
                    seatResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/branches"
                    ),
                    fetch(
                        "http://localhost:5000/api/screens"
                    ),
                    fetch(
                        "http://localhost:5000/api/seats"
                    ),
                ]);

                if (
                    !branchResponse.ok ||
                    !screenResponse.ok ||
                    !seatResponse.ok
                ) {
                    throw new Error(
                        "Failed to load seat management data."
                    );
                }

                const branchData =
                    await branchResponse.json();

                const screenData =
                    await screenResponse.json();

                const seatData =
                    await seatResponse.json();

                setBranches(branchData);
                setScreens(screenData);
                setSeats(seatData);

                if (screenData.length > 0) {
                    setSelectedScreenID(
                        Number(
                            screenData[0].screenID
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load seat management data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const selectedScreen =
        screens.find(
            (screen) =>
                Number(screen.screenID) ===
                Number(selectedScreenID)
        );

    const selectedBranch =
        branches.find(
            (branch) =>
                Number(branch.branchID) ===
                Number(selectedScreen?.branchID)
        );

    const screenSeats =
        seats.filter(
            (seat) =>
                Number(seat.screenID) ===
                Number(selectedScreenID)
        );

    const resetForm = () => {
        setShowForm(false);
        setEditingSeat(null);

        setFormData({
            seatNumber: "",
            status: "Available",
        });
    };

    const handleScreenChange = (event) => {
        setSelectedScreenID(
            Number(event.target.value)
        );

        resetForm();
    };

    const handleAddSeat = () => {
        if (!selectedScreen) {
            alert(
                "Please select a cinema screen first."
            );
            return;
        }

        setEditingSeat(null);

        setFormData({
            seatNumber: "",
            status: "Available",
        });

        setShowForm(true);
    };

    const handleEditSeat = (seat) => {
        setEditingSeat(seat);

        setFormData({
            seatNumber: seat.seatNumber,
            status:
                seat.status || "Available",
        });

        setShowForm(true);
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedScreen) {
            alert(
                "Please select a cinema screen."
            );
            return;
        }

        const seatNumber =
            formData.seatNumber
                .trim()
                .toUpperCase();

        if (!seatNumber) {
            alert(
                "Please enter a seat number."
            );
            return;
        }

        const seatPattern =
            /^[A-Z]+[0-9]+$/;

        if (!seatPattern.test(seatNumber)) {
            alert(
                "Please enter a valid seat number such as A1, A2 or G1."
            );
            return;
        }

        const duplicateSeat =
            screenSeats.find(
                (seat) =>
                    seat.seatNumber
                        .toUpperCase() ===
                        seatNumber &&
                    seat.seatID !==
                        editingSeat?.seatID
            );

        if (duplicateSeat) {
            alert(
                "This seat number already exists for this screen."
            );
            return;
        }

        if (!editingSeat) {
            const screenCapacity =
                Number(
                    selectedScreen.capacity
                ) || 0;

            if (
                screenSeats.length >=
                screenCapacity
            ) {
                alert(
                    "This screen has reached its seat capacity."
                );
                return;
            }
        }

        const seatData = {
            seatID:
                `${selectedScreenID}-${seatNumber}`,
            screenID:
                Number(
                    selectedScreen.screenID
                ),
            branchID:
                Number(
                    selectedScreen.branchID
                ),
            screenName:
                selectedScreen.screenName,
            branchName:
                selectedBranch?.branchName ||
                "Unknown Branch",
            seatNumber,
            status:
                formData.status,
        };

        try {
            if (editingSeat) {
                const response =
                    await fetch(
                        `http://localhost:5000/api/seats/${editingSeat.seatID}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    seatData
                                ),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Seat update failed."
                    );
                }

                const updatedSeats =
                    seats.map(
                        (seat) =>
                            seat.seatID ===
                            editingSeat.seatID
                                ? data.seat
                                : seat
                    );

                setSeats(updatedSeats);

                alert(
                    "Seat information updated successfully."
                );
            } else {
                const response =
                    await fetch(
                        "http://localhost:5000/api/seats",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body:
                                JSON.stringify(
                                    seatData
                                ),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Seat creation failed."
                    );
                }

                const updatedSeats = [
                    ...seats,
                    data.seat,
                ];

                setSeats(updatedSeats);

                alert(
                    "Seat added successfully."
                );
            }

            resetForm();
        } catch (error) {
            console.error(
                "Seat operation failed:",
                error
            );

            alert(
                error.message ||
                    "Seat operation failed."
            );
        }
    };

    const handleDeleteSeat = async (
        seatID
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this seat?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/seats/${seatID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Seat deletion failed."
                );
            }

            const updatedSeats =
                seats.filter(
                    (seat) =>
                        seat.seatID !==
                        seatID
                );

            setSeats(updatedSeats);

            if (
                editingSeat?.seatID ===
                seatID
            ) {
                resetForm();
            }

            alert(
                "Seat deleted successfully."
            );
        } catch (error) {
            console.error(
                "Seat deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Seat deletion failed."
            );
        }
    };

    const seatRows =
        Array.from(
            new Set(
                screenSeats
                    .map(
                        (seat) =>
                            seat.seatNumber
                                ?.match(
                                    /^[A-Z]+/
                                )?.[0]
                    )
                    .filter(Boolean)
            )
        ).sort(
            (a, b) =>
                a.localeCompare(b)
        );

    const getSeatsForRow = (row) => {
        return screenSeats
            .filter(
                (seat) =>
                    seat.seatNumber
                        ?.match(
                            /^[A-Z]+/
                        )?.[0] === row
            )
            .sort(
                (a, b) => {
                    const aNumber =
                        Number(
                            a.seatNumber.replace(
                                row,
                                ""
                            )
                        );

                    const bNumber =
                        Number(
                            b.seatNumber.replace(
                                row,
                                ""
                            )
                        );

                    return (
                        aNumber -
                        bNumber
                    );
                }
            );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading seats...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10">
            <div className="w-[90%] max-w-7xl mx-auto">
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
                                <FaChair className="text-2xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Seats
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Manage seats for each cinema screen.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddSeat
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Seat
                    </button>
                </div>

                <div className="card bg-base-100 shadow-md mb-8">
                    <div className="card-body">
                        <h2 className="text-xl font-bold">
                            Select Cinema Screen
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Cinema Screen
                                    </span>
                                </label>

                                <select
                                    value={
                                        selectedScreenID
                                    }
                                    onChange={
                                        handleScreenChange
                                    }
                                    className="select select-bordered w-full"
                                >
                                    {screens.length ===
                                    0 ? (
                                        <option value="">
                                            No Screens Available
                                        </option>
                                    ) : (
                                        screens.map(
                                            (
                                                screen
                                            ) => {
                                                const branch =
                                                    branches.find(
                                                        (
                                                            item
                                                        ) =>
                                                            Number(
                                                                item.branchID
                                                            ) ===
                                                            Number(
                                                                screen.branchID
                                                            )
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            screen.screenID
                                                        }
                                                        value={
                                                            screen.screenID
                                                        }
                                                    >
                                                        {
                                                            branch?.branchName ||
                                                            "Unknown Branch"
                                                        }
                                                        {" - "}
                                                        {
                                                            screen.screenName
                                                        }
                                                    </option>
                                                );
                                            }
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Screen Capacity
                                    </span>
                                </label>

                                <div className="input input-bordered w-full flex items-center">
                                    {
                                        selectedScreen?.capacity ||
                                        0
                                    }
                                    {" seats"}
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Current Seats
                                    </span>
                                </label>

                                <div className="input input-bordered w-full flex items-center">
                                    {
                                        screenSeats.length
                                    }
                                    {" seats"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showForm && (
                    <div className="card bg-base-100 shadow-md mb-8">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold">
                                {editingSeat
                                    ? "Edit Seat"
                                    : "Add Seat"}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                {
                                    selectedBranch?.branchName
                                }
                                {" • "}
                                {
                                    selectedScreen?.screenName
                                }
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
                                            Seat Number
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="seatNumber"
                                        value={
                                            formData.seatNumber
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="A1"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                    <label className="label">
                                        <span className="label-text-alt text-base-content/60">
                                            Example: A1, A2, B1, B2
                                        </span>
                                    </label>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Seat Status
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
                                        <option value="Available">
                                            Available
                                        </option>

                                        <option value="Unavailable">
                                            Unavailable
                                        </option>
                                    </select>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {editingSeat
                                            ? "Update Seat"
                                            : "Add Seat"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            resetForm
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
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Seat List
                                </h2>

                                <p className="text-sm text-base-content/60 mt-1">
                                    {
                                        selectedBranch?.branchName ||
                                        "Unknown Branch"
                                    }
                                    {" • "}
                                    {
                                        selectedScreen?.screenName ||
                                        "Unknown Screen"
                                    }
                                </p>
                            </div>

                            <div className="badge badge-primary badge-lg">
                                {
                                    screenSeats.length
                                }
                                {" Seats"}
                            </div>
                        </div>

                        <div className="divider"></div>

                        {screenSeats.length >
                        0 ? (
                            <div className="flex flex-col items-center gap-4 py-6">
                                {seatRows.map(
                                    (row) => {
                                        const rowSeats =
                                            getSeatsForRow(
                                                row
                                            );

                                        return (
                                            <div
                                                key={
                                                    row
                                                }
                                                className="flex items-center gap-3"
                                            >
                                                <span className="w-6 text-center font-bold">
                                                    {
                                                        row
                                                    }
                                                </span>

                                                <div className="flex flex-wrap gap-2">
                                                    {rowSeats.map(
                                                        (
                                                            seat
                                                        ) => (
                                                            <div
                                                                key={
                                                                    seat.seatID
                                                                }
                                                                className={`relative w-16 h-12 rounded-lg border flex items-center justify-center ${
                                                                    seat.status ===
                                                                    "Available"
                                                                        ? "bg-success/10 border-success/30"
                                                                        : "bg-error/10 border-error/30"
                                                                }`}
                                                            >
                                                                <div className="text-center">
                                                                    <FaChair className="mx-auto text-sm" />

                                                                    <span className="text-xs font-semibold">
                                                                        {
                                                                            seat.seatNumber
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <FaChair className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Seats Found
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add seats for this screen.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddSeat
                                    }
                                    className="btn btn-primary mt-4"
                                >
                                    <FaPlus />
                                    Add Seat
                                </button>
                            </div>
                        )}

                        {screenSeats.length >
                            0 && (
                            <>
                                <div className="divider"></div>

                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Seat ID
                                                </th>

                                                <th>
                                                    Seat Number
                                                </th>

                                                <th>
                                                    Screen
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
                                            {screenSeats.map(
                                                (
                                                    seat
                                                ) => (
                                                    <tr
                                                        key={
                                                            seat.seatID
                                                        }
                                                    >
                                                        <td>
                                                            {
                                                                seat.seatID
                                                            }
                                                        </td>

                                                        <td>
                                                            <span className="badge badge-primary">
                                                                {
                                                                    seat.seatNumber
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {
                                                                selectedScreen?.screenName
                                                            }
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    seat.status ===
                                                                    "Available"
                                                                        ? "badge-success"
                                                                        : "badge-error"
                                                                }`}
                                                            >
                                                                {
                                                                    seat.status
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditSeat(
                                                                            seat
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
                                                                        handleDeleteSeat(
                                                                            seat.seatID
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageSeats;