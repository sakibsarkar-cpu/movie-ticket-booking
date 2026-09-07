import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function ManageShowSchedules() {
    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [screens, setScreens] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        movieID: "",
        branchID: "",
        screenID: "",
        showDate: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        status: "Active",
    });

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                movieResponse,
                branchResponse,
                screenResponse,
                scheduleResponse,
            ] = await Promise.all([
                fetch("http://localhost:5000/api/movies"),
                fetch("http://localhost:5000/api/branches"),
                fetch("http://localhost:5000/api/screens"),
                fetch("http://localhost:5000/api/schedules"),
            ]);

            if (
                !movieResponse.ok ||
                !branchResponse.ok ||
                !screenResponse.ok ||
                !scheduleResponse.ok
            ) {
                throw new Error(
                    "Failed to load show schedule data."
                );
            }

            const movieData = await movieResponse.json();
            const branchData = await branchResponse.json();
            const screenData = await screenResponse.json();
            const scheduleData = await scheduleResponse.json();

            const normalizedSchedules =
                scheduleData.map((schedule) => {
                    const selectedScreen =
                        screenData.find(
                            (screen) =>
                                Number(screen.screenID) ===
                                Number(schedule.screenID)
                        );

                    const selectedMovie =
                        movieData.find(
                            (movie) =>
                                Number(movie.movieID) ===
                                Number(schedule.movieID)
                        );

                    const selectedBranch =
                        branchData.find(
                            (branch) =>
                                Number(branch.branchID) ===
                                Number(schedule.branchID)
                        );

                    return {
                        ...schedule,
                        scheduleID:
                            Number(schedule.scheduleID),
                        movieID:
                            Number(schedule.movieID),
                        branchID:
                            Number(schedule.branchID),
                        screenID:
                            Number(schedule.screenID),
                        movieTitle:
                            schedule.movieTitle ||
                            selectedMovie?.title ||
                            "Unknown Movie",
                        branchName:
                            schedule.branchName ||
                            selectedBranch?.branchName ||
                            "Unknown Branch",
                        location:
                            schedule.location ||
                            selectedBranch?.location ||
                            "",
                        screenName:
                            schedule.screenName ||
                            selectedScreen?.screenName ||
                            "Unknown Screen",
                        ticketPrice:
                            Number(schedule.ticketPrice),
                        status:
                            schedule.status === "Active" ||
                            schedule.status === "active" ||
                            schedule.status === true
                                ? "Active"
                                : "Inactive",
                    };
                });

            setMovies(movieData);
            setBranches(branchData);
            setScreens(screenData);
            setSchedules(normalizedSchedules);
        } catch (error) {
            console.error(
                "Error loading schedule data:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const availableScreens = screens.filter(
        (screen) =>
            Number(screen.branchID) ===
                Number(formData.branchID) &&
            screen.status !== "Inactive"
    );

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "branchID") {
            const branchScreens = screens.filter(
                (screen) =>
                    Number(screen.branchID) ===
                        Number(value) &&
                    screen.status !== "Inactive"
            );

            setFormData((previousData) => ({
                ...previousData,
                branchID: Number(value),
                screenID:
                    branchScreens.length > 0
                        ? Number(
                              branchScreens[0].screenID
                          )
                        : "",
            }));

            return;
        }

        if (
            name === "movieID" ||
            name === "screenID"
        ) {
            setFormData((previousData) => ({
                ...previousData,
                [name]: Number(value),
            }));

            return;
        }

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleAddSchedule = () => {
        const firstMovie =
            movies.length > 0
                ? Number(movies[0].movieID)
                : "";

        const firstBranch =
            branches.length > 0
                ? Number(branches[0].branchID)
                : "";

        const firstBranchScreens =
            screens.filter(
                (screen) =>
                    Number(screen.branchID) ===
                        Number(firstBranch) &&
                    screen.status !== "Inactive"
            );

        setEditingSchedule(null);

        setFormData({
            movieID: firstMovie,
            branchID: firstBranch,
            screenID:
                firstBranchScreens.length > 0
                    ? Number(
                          firstBranchScreens[0]
                              .screenID
                      )
                    : "",
            showDate: "",
            startTime: "",
            endTime: "",
            ticketPrice: "",
            status: "Active",
        });

        setShowForm(true);
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);

        setFormData({
            movieID: Number(schedule.movieID),
            branchID: Number(schedule.branchID),
            screenID: Number(schedule.screenID),
            showDate: schedule.showDate || "",
            startTime: schedule.startTime || "",
            endTime: schedule.endTime || "",
            ticketPrice:
                schedule.ticketPrice || "",
            status:
                schedule.status === "Active"
                    ? "Active"
                    : "Inactive",
        });

        setShowForm(true);
    };

    const handleDeleteSchedule = async (
        scheduleID
    ) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this show schedule?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/schedules/${scheduleID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Show schedule deletion failed."
                );
            }

            const updatedSchedules =
                schedules.filter(
                    (schedule) =>
                        Number(
                            schedule.scheduleID
                        ) !==
                        Number(scheduleID)
                );

            setSchedules(updatedSchedules);

            alert(
                "Show schedule deleted successfully."
            );
        } catch (error) {
            console.error(
                "Show schedule deletion failed:",
                error
            );

            alert(
                error.message ||
                    "Show schedule deletion failed."
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

        if (!formData.showDate) {
            alert("Please select a show date.");
            return;
        }

        if (!formData.startTime) {
            alert(
                "Please select a start time."
            );
            return;
        }

        if (!formData.endTime) {
            alert(
                "Please select an end time."
            );
            return;
        }

        const normalizeTime = (time) => {
            const match = time.match(
                /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
            );

            if (!match) {
                return time;
            }

            let hour = Number(match[1]);
            const minute = Number(match[2]);
            const period = match[3];

            if (period) {
                if (
                    period.toUpperCase() ===
                        "PM" &&
                    hour !== 12
                ) {
                    hour += 12;
                }

                if (
                    period.toUpperCase() ===
                        "AM" &&
                    hour === 12
                ) {
                    hour = 0;
                }
            }

            return hour * 60 + minute;
        };

        if (
            normalizeTime(
                formData.startTime
            ) >=
            normalizeTime(
                formData.endTime
            )
        ) {
            alert(
                "End time must be later than start time."
            );
            return;
        }

        if (
            !formData.ticketPrice ||
            Number(formData.ticketPrice) <= 0
        ) {
            alert(
                "Please enter a valid ticket price."
            );
            return;
        }

        const selectedMovie =
            movies.find(
                (movie) =>
                    Number(movie.movieID) ===
                    Number(formData.movieID)
            );

        const selectedBranch =
            branches.find(
                (branch) =>
                    Number(branch.branchID) ===
                    Number(formData.branchID)
            );

        const selectedScreen =
            screens.find(
                (screen) =>
                    Number(screen.screenID) ===
                        Number(formData.screenID) &&
                    Number(screen.branchID) ===
                        Number(formData.branchID)
            );

        if (!selectedMovie) {
            alert(
                "Selected movie could not be found."
            );
            return;
        }

        if (!selectedBranch) {
            alert(
                "Selected cinema branch could not be found."
            );
            return;
        }

        if (!selectedScreen) {
            alert(
                "Selected screen could not be found for this branch."
            );
            return;
        }

        const conflictingSchedule =
            schedules.find(
                (schedule) =>
                    Number(schedule.screenID) ===
                        Number(
                            formData.screenID
                        ) &&
                    schedule.showDate ===
                        formData.showDate &&
                    schedule.startTime ===
                        formData.startTime &&
                    Number(
                        schedule.scheduleID
                    ) !==
                        Number(
                            editingSchedule?.scheduleID
                        )
            );

        if (conflictingSchedule) {
            alert(
                "This screen already has a show scheduled at this date and time."
            );
            return;
        }

        const scheduleData = {
            scheduleID:
                editingSchedule
                    ? Number(
                          editingSchedule.scheduleID
                      )
                    : schedules.length > 0
                    ? Math.max(
                          ...schedules.map(
                              (schedule) =>
                                  Number(
                                      schedule.scheduleID
                                  ) || 0
                          )
                      ) + 1
                    : 1,
            movieID:
                Number(formData.movieID),
            movieTitle:
                selectedMovie.title,
            branchID:
                Number(formData.branchID),
            branchName:
                selectedBranch.branchName,
            location:
                selectedBranch.location,
            screenID:
                Number(formData.screenID),
            screenName:
                selectedScreen.screenName,
            showDate:
                formData.showDate,
            startTime:
                formData.startTime,
            endTime:
                formData.endTime,
            ticketPrice:
                Number(formData.ticketPrice),
            status:
                formData.status === "Active"
                    ? "Active"
                    : "Inactive",
        };

        try {
            let response;

            if (editingSchedule) {
                response =
                    await fetch(
                        `http://localhost:5000/api/schedules/${editingSchedule.scheduleID}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify(
                                scheduleData
                            ),
                        }
                    );
            } else {
                response =
                    await fetch(
                        "http://localhost:5000/api/schedules",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify(
                                scheduleData
                            ),
                        }
                    );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Show schedule operation failed."
                );
            }

            let updatedSchedules;

            if (editingSchedule) {
                updatedSchedules =
                    schedules.map(
                        (schedule) =>
                            Number(
                                schedule.scheduleID
                            ) ===
                            Number(
                                editingSchedule.scheduleID
                            )
                                ? data.schedule
                                : schedule
                    );

                alert(
                    "Show schedule updated successfully."
                );
            } else {
                updatedSchedules = [
                    ...schedules,
                    data.schedule,
                ];

                alert(
                    "Show schedule added successfully."
                );
            }

            setSchedules(
                updatedSchedules
            );

            handleCancel();
        } catch (error) {
            console.error(
                "Show schedule operation failed:",
                error
            );

            alert(
                error.message ||
                    "Show schedule operation failed."
            );
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSchedule(null);

        setFormData({
            movieID: "",
            branchID: "",
            screenID: "",
            showDate: "",
            startTime: "",
            endTime: "",
            ticketPrice: "",
            status: "Active",
        });
    };

    const getMovieTitle = (movieID) => {
        const movie =
            movies.find(
                (item) =>
                    Number(item.movieID) ===
                    Number(movieID)
            );

        return movie
            ? movie.title
            : "Unknown Movie";
    };

    const getBranchName = (branchID) => {
        const branch =
            branches.find(
                (item) =>
                    Number(item.branchID) ===
                    Number(branchID)
            );

        return branch
            ? branch.branchName
            : "Unknown Branch";
    };

    const getScreenName = (screenID) => {
        const screen =
            screens.find(
                (item) =>
                    Number(item.screenID) ===
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
                        Loading show schedules...
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
                                <FaCalendarAlt className="text-2xl" />
                            </div>

                            <div>
                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Show Schedules
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Add, edit and delete movie show schedules.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddSchedule
                        }
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Schedule
                    </button>
                </div>

                {showForm && (
                    <div className="card bg-base-100 shadow-md mb-8">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold">
                                {editingSchedule
                                    ? "Edit Show Schedule"
                                    : "Add Show Schedule"}
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Enter the movie, cinema, screen, date, time and ticket price.
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
                                            (movie) => (
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
                                            Select Cinema Branch
                                        </option>

                                        {branches
                                            .filter(
                                                (
                                                    branch
                                                ) =>
                                                    branch.status !==
                                                    "Inactive"
                                            )
                                            .map(
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
                                            Show Date
                                        </span>
                                    </label>

                                    <input
                                        type="date"
                                        name="showDate"
                                        value={
                                            formData.showDate
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                Start Time
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="startTime"
                                            value={
                                                formData.startTime
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="10:00 AM"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                End Time
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="endTime"
                                            value={
                                                formData.endTime
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="12:30 PM"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-control mt-4">
                                    <label className="label">
                                        <span className="label-text">
                                            Ticket Price
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="ticketPrice"
                                        value={
                                            formData.ticketPrice
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        min="1"
                                        placeholder="350"
                                        className="input input-bordered w-full"
                                        required
                                    />
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
                                        {editingSchedule
                                            ? "Update Schedule"
                                            : "Add Schedule"}
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
                        <h2 className="text-2xl font-bold">
                            Show Schedule List
                        </h2>

                        <p className="text-sm text-base-content/60 mt-1">
                            Total Schedules:{" "}
                            {schedules.length}
                        </p>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Movie</th>
                                        <th>Cinema</th>
                                        <th>Screen</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {schedules.map(
                                        (schedule) => {
                                            const isActive =
                                                schedule.status ===
                                                    true ||
                                                schedule.status ===
                                                    "Active" ||
                                                schedule.status ===
                                                    "active";

                                            return (
                                                <tr
                                                    key={
                                                        schedule.scheduleID
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            schedule.scheduleID
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        {
                                                            getMovieTitle(
                                                                schedule.movieID
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            getBranchName(
                                                                schedule.branchID
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            getScreenName(
                                                                schedule.screenID
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            schedule.showDate
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            schedule.startTime
                                                        }
                                                        {" - "}
                                                        {
                                                            schedule.endTime
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        ৳
                                                        {
                                                            schedule.ticketPrice
                                                        }
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                isActive
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >
                                                            {isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditSchedule(
                                                                        schedule
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
                                                                    handleDeleteSchedule(
                                                                        schedule.scheduleID
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
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {schedules.length ===
                            0 && (
                            <div className="text-center py-10">
                                <FaCalendarAlt className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Show Schedules
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a show schedule to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddSchedule
                                    }
                                    className="btn btn-primary mt-4"
                                >
                                    <FaPlus />
                                    Add Schedule
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageShowSchedules;