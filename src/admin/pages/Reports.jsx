import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaChartBar,
    FaTicketAlt,
    FaMoneyBillWave,
    FaUsers,
    FaFilm,
    FaBuilding,
    FaCreditCard,
    FaSearch,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function Reports() {
    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [schedules, setSchedules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [reportSubmitted, setReportSubmitted] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [
                    bookingsResponse,
                    moviesResponse,
                    branchesResponse,
                    schedulesResponse,
                ] = await Promise.all([
                    fetch(`${API_URL}/bookings`),
                    fetch(`${API_URL}/movies`),
                    fetch(`${API_URL}/branches`),
                    fetch(`${API_URL}/schedules`),
                ]);

                const [
                    bookingsData,
                    moviesData,
                    branchesData,
                    schedulesData,
                ] = await Promise.all([
                    bookingsResponse.json(),
                    moviesResponse.json(),
                    branchesResponse.json(),
                    schedulesResponse.json(),
                ]);

                if (!bookingsResponse.ok) {
                    throw new Error(
                        bookingsData.message ||
                        "Failed to load bookings."
                    );
                }

                if (!moviesResponse.ok) {
                    throw new Error(
                        moviesData.message ||
                        "Failed to load movies."
                    );
                }

                if (!branchesResponse.ok) {
                    throw new Error(
                        branchesData.message ||
                        "Failed to load cinema branches."
                    );
                }

                if (!schedulesResponse.ok) {
                    throw new Error(
                        schedulesData.message ||
                        "Failed to load schedules."
                    );
                }

                setBookings(
                    Array.isArray(bookingsData)
                        ? bookingsData
                        : []
                );

                setMovies(
                    Array.isArray(moviesData)
                        ? moviesData
                        : []
                );

                setBranches(
                    Array.isArray(branchesData)
                        ? branchesData
                        : []
                );

                setSchedules(
                    Array.isArray(schedulesData)
                        ? schedulesData
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load report data:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to load report data."
                );

                setBookings([]);
                setMovies([]);
                setBranches([]);
                setSchedules([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getSchedule = (booking) => {
        if (!booking) {
            return null;
        }

        return (
            schedules.find(
                (schedule) =>
                    Number(schedule.scheduleID) ===
                    Number(booking.scheduleID)
            ) || null
        );
    };

    const getBranch = (booking) => {
        if (!booking) {
            return null;
        }

        if (
            booking.branchID !== undefined &&
            booking.branchID !== null &&
            booking.branchID !== ""
        ) {
            const branchByID = branches.find(
                (branch) =>
                    Number(branch.branchID) ===
                    Number(booking.branchID)
            );

            if (branchByID) {
                return branchByID;
            }
        }

        const schedule = getSchedule(booking);

        if (
            schedule?.branchID !== undefined &&
            schedule?.branchID !== null
        ) {
            const branchByScheduleID = branches.find(
                (branch) =>
                    Number(branch.branchID) ===
                    Number(schedule.branchID)
            );

            if (branchByScheduleID) {
                return branchByScheduleID;
            }
        }

        if (booking.branchName) {
            const branchByName = branches.find(
                (branch) =>
                    branch.branchName ===
                    booking.branchName
            );

            if (branchByName) {
                return branchByName;
            }
        }

        return null;
    };

    const getMovie = (booking) => {
        if (!booking) {
            return null;
        }

        const movieByID = movies.find(
            (movie) =>
                Number(movie.movieID) ===
                Number(booking.movieID)
        );

        if (movieByID) {
            return movieByID;
        }

        const schedule = getSchedule(booking);

        if (
            schedule?.movieID !== undefined &&
            schedule?.movieID !== null
        ) {
            const movieByScheduleID = movies.find(
                (movie) =>
                    Number(movie.movieID) ===
                    Number(schedule.movieID)
            );

            if (movieByScheduleID) {
                return movieByScheduleID;
            }
        }

        return null;
    };

    const getSelectedSeats = (booking) => {
        if (Array.isArray(booking.selectedSeats)) {
            return booking.selectedSeats;
        }

        if (Array.isArray(booking.seats)) {
            return booking.seats;
        }

        return [];
    };

    const confirmedBookingData = bookings.filter(
        (booking) =>
            booking.status === "Confirmed"
    );

    const totalBookings = bookings.length;

    const confirmedBookings =
        confirmedBookingData.length;

    const totalRevenue =
        confirmedBookingData.reduce(
            (total, booking) =>
                total +
                Number(
                    booking.totalAmount || 0
                ),
            0
        );

    const totalSeats =
        confirmedBookingData.reduce(
            (total, booking) =>
                total +
                getSelectedSeats(booking).length,
            0
        );

    const movieReport = movies.map(
        (movie) => {
            const movieBookings =
                confirmedBookingData.filter(
                    (booking) =>
                        Number(booking.movieID) ===
                        Number(movie.movieID)
                );

            const movieSeats =
                movieBookings.reduce(
                    (total, booking) =>
                        total +
                        getSelectedSeats(
                            booking
                        ).length,
                    0
                );

            const movieRevenue =
                movieBookings.reduce(
                    (total, booking) =>
                        total +
                        Number(
                            booking.totalAmount ||
                            0
                        ),
                    0
                );

            return {
                movieID: movie.movieID,
                title: movie.title,
                bookings: movieBookings.length,
                seats: movieSeats,
                revenue: movieRevenue,
            };
        }
    );

    const branchReport = branches.map(
        (branch) => {
            const branchBookings =
                confirmedBookingData.filter(
                    (booking) => {
                        const bookingBranch =
                            getBranch(booking);

                        return (
                            bookingBranch &&
                            Number(
                                bookingBranch.branchID
                            ) ===
                            Number(
                                branch.branchID
                            )
                        );
                    }
                );

            const branchRevenue =
                branchBookings.reduce(
                    (total, booking) =>
                        total +
                        Number(
                            booking.totalAmount ||
                            0
                        ),
                    0
                );

            return {
                branchID: branch.branchID,
                branchName: branch.branchName,
                bookings: branchBookings.length,
                revenue: branchRevenue,
            };
        }
    );

    const unknownBranchBookings =
        confirmedBookingData.filter(
            (booking) =>
                !getBranch(booking)
        );

    const unknownBranchRevenue =
        unknownBranchBookings.reduce(
            (total, booking) =>
                total +
                Number(
                    booking.totalAmount || 0
                ),
            0
        );

    const paymentMethods = [
        "card",
        "mobile banking",
        "cash",
    ];

    const paymentReport = paymentMethods.map(
        (method) => {
            const methodBookings =
                confirmedBookingData.filter(
                    (booking) =>
                        String(
                            booking.paymentMethod ||
                            ""
                        ).toLowerCase() ===
                        method
                );

            const methodRevenue =
                methodBookings.reduce(
                    (total, booking) =>
                        total +
                        Number(
                            booking.totalAmount ||
                            0
                        ),
                    0
                );

            return {
                method,
                bookings: methodBookings.length,
                revenue: methodRevenue,
            };
        }
    );

    const mostPopularMovie =
        [...movieReport].sort(
            (a, b) =>
                b.bookings - a.bookings
        )[0];

    const mostPopularBranch =
        [...branchReport].sort(
            (a, b) =>
                b.bookings - a.bookings
        )[0];

    const handleSubmitReport = () => {
        if (!selectedDate) {
            return;
        }

        setReportSubmitted(true);
    };

    const filteredReportBookings =
        reportSubmitted
            ? bookings.filter((booking) => {
                const bookingDate =
                    booking.showDate ||
                    getSchedule(booking)?.showDate ||
                    "";

                const bookingBranch =
                    getBranch(booking);

                const bookingMovie =
                    getMovie(booking);

                const dateMatches =
                    bookingDate ===
                    selectedDate;

                const branchMatches =
                    !selectedBranch ||
                    (
                        bookingBranch &&
                        Number(
                            bookingBranch.branchID
                        ) ===
                        Number(
                            selectedBranch
                        )
                    );

                const movieMatches =
                    !selectedMovie ||
                    (
                        bookingMovie &&
                        Number(
                            bookingMovie.movieID
                        ) ===
                        Number(
                            selectedMovie
                        )
                    );

                return (
                    dateMatches &&
                    branchMatches &&
                    movieMatches
                );
            })
            : [];

    const filteredConfirmedBookings =
        filteredReportBookings.filter(
            (booking) =>
                booking.status ===
                "Confirmed"
        );

    const filteredCancelledBookings =
        filteredReportBookings.filter(
            (booking) =>
                booking.status ===
                "Cancelled"
        );

    const filteredSeats =
        filteredConfirmedBookings.reduce(
            (total, booking) =>
                total +
                getSelectedSeats(
                    booking
                ).length,
            0
        );

    const filteredRevenue =
        filteredConfirmedBookings.reduce(
            (total, booking) =>
                total +
                Number(
                    booking.totalAmount || 0
                ),
            0
        );

    const selectedBranchObject =
        branches.find(
            (branch) =>
                Number(branch.branchID) ===
                Number(selectedBranch)
        );

    const selectedMovieObject =
        movies.find(
            (movie) =>
                Number(movie.movieID) ===
                Number(selectedMovie)
        );

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

                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <FaChartBar className="text-2xl" />
                        </div>

                        <div>
                            <p className="text-primary font-semibold text-sm">
                                ADMINISTRATION
                            </p>

                            <h1 className="text-3xl font-bold">
                                Reports
                            </h1>

                            <p className="text-base-content/60 mt-1">
                                View system and booking reports.
                            </p>
                        </div>

                    </div>
                </div>

                {errorMessage && (
                    <div className="alert alert-error mb-8">
                        <span>
                            {errorMessage}
                        </span>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Total Bookings
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {loading
                                            ? "..."
                                            : totalBookings}
                                    </p>
                                </div>

                                <FaTicketAlt className="text-primary text-3xl" />

                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Confirmed Bookings
                                    </p>

                                    <p className="text-3xl font-bold text-success mt-2">
                                        {loading
                                            ? "..."
                                            : confirmedBookings}
                                    </p>
                                </div>

                                <FaChartBar className="text-success text-3xl" />

                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Total Revenue
                                    </p>

                                    <p className="text-3xl font-bold text-primary mt-2">
                                        {loading
                                            ? "..."
                                            : `৳${totalRevenue}`}
                                    </p>
                                </div>

                                <FaMoneyBillWave className="text-primary text-3xl" />

                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Seats Booked
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {loading
                                            ? "..."
                                            : totalSeats}
                                    </p>
                                </div>

                                <FaUsers className="text-primary text-3xl" />

                            </div>
                        </div>
                    </div>

                </div>

                {!loading &&
                    totalBookings > 0 && (
                        <div className="grid md:grid-cols-2 gap-6 mb-8">

                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">

                                    <div className="flex items-center gap-3">

                                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                            <FaFilm />
                                        </div>

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Most Booked Movie
                                            </p>

                                            <h2 className="text-xl font-bold">
                                                {mostPopularMovie?.title ||
                                                    "No data"}
                                            </h2>
                                        </div>

                                    </div>

                                    <div className="divider my-2"></div>

                                    <p className="text-base-content/60">
                                        Bookings:
                                        <span className="font-bold text-base-content ml-2">
                                            {mostPopularMovie?.bookings ||
                                                0}
                                        </span>
                                    </p>

                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">

                                    <div className="flex items-center gap-3">

                                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                            <FaBuilding />
                                        </div>

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Most Booked Cinema
                                            </p>

                                            <h2 className="text-xl font-bold">
                                                {mostPopularBranch?.branchName ||
                                                    "No data"}
                                            </h2>
                                        </div>

                                    </div>

                                    <div className="divider my-2"></div>

                                    <p className="text-base-content/60">
                                        Bookings:
                                        <span className="font-bold text-base-content ml-2">
                                            {mostPopularBranch?.bookings ||
                                                0}
                                        </span>
                                    </p>

                                </div>
                            </div>

                        </div>
                    )}

                <div className="card bg-base-100 shadow-md mb-8">
                    <div className="card-body">

                        <div className="flex items-center gap-3 mb-2">
                            <FaSearch className="text-primary text-xl" />

                            <h2 className="text-2xl font-bold">
                                Booking Report
                            </h2>
                        </div>

                        <p className="text-sm text-base-content/60">
                            Select a date to view booking information. Branch and movie filters are optional.
                        </p>

                        <div className="divider"></div>

                        <div className="grid md:grid-cols-3 gap-5">

                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Select Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => {
                                        setSelectedDate(
                                            event.target.value
                                        );
                                        setReportSubmitted(false);
                                    }}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Select Cinema Branch
                                    </span>
                                </label>

                                <select
                                    value={selectedBranch}
                                    onChange={(event) => {
                                        setSelectedBranch(
                                            event.target.value
                                        );
                                        setReportSubmitted(false);
                                    }}
                                    className="select select-bordered w-full"
                                >

                                    <option value="">
                                        All Branches
                                    </option>

                                    {branches.map(
                                        (branch) => (
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

                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Select Movie
                                    </span>
                                </label>

                                <select
                                    value={selectedMovie}
                                    onChange={(event) => {
                                        setSelectedMovie(
                                            event.target.value
                                        );
                                        setReportSubmitted(false);
                                    }}
                                    className="select select-bordered w-full"
                                >

                                    <option value="">
                                        All Movies
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

                        </div>

                        <div className="flex justify-center mt-6">

                            <button
                                onClick={
                                    handleSubmitReport
                                }
                                disabled={!selectedDate}
                                className="btn btn-primary px-10"
                            >
                                <FaSearch />
                                Search Report
                            </button>

                        </div>

                        {reportSubmitted && (
                            <div className="mt-8">

                                <div className="bg-base-200 rounded-lg p-5 mb-6">

                                    <h3 className="text-xl font-bold mb-4">
                                        Selected Report
                                    </h3>

                                    <div className="grid md:grid-cols-3 gap-4">

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Date
                                            </p>

                                            <p className="font-semibold">
                                                {selectedDate}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Cinema Branch
                                            </p>

                                            <p className="font-semibold">
                                                {selectedBranchObject?.branchName ||
                                                    "All Branches"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-base-content/60">
                                                Movie
                                            </p>

                                            <p className="font-semibold">
                                                {selectedMovieObject?.title ||
                                                    "All Movies"}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                                    <div className="bg-base-200 rounded-lg p-4">
                                        <p className="text-sm text-base-content/60">
                                            Total Bookings
                                        </p>

                                        <p className="text-2xl font-bold mt-1">
                                            {
                                                filteredReportBookings.length
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-base-200 rounded-lg p-4">
                                        <p className="text-sm text-base-content/60">
                                            Confirmed
                                        </p>

                                        <p className="text-2xl font-bold text-success mt-1">
                                            {
                                                filteredConfirmedBookings.length
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-base-200 rounded-lg p-4">
                                        <p className="text-sm text-base-content/60">
                                            Cancelled
                                        </p>

                                        <p className="text-2xl font-bold text-error mt-1">
                                            {
                                                filteredCancelledBookings.length
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-base-200 rounded-lg p-4">
                                        <p className="text-sm text-base-content/60">
                                            Seats Sold
                                        </p>

                                        <p className="text-2xl font-bold mt-1">
                                            {
                                                filteredSeats
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-base-200 rounded-lg p-4">
                                        <p className="text-sm text-base-content/60">
                                            Revenue
                                        </p>

                                        <p className="text-2xl font-bold text-primary mt-1">
                                            ৳
                                            {
                                                filteredRevenue
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="overflow-x-auto">

                                    {filteredReportBookings.length >
                                        0 ? (

                                        <table className="table">

                                            <thead>
                                                <tr>
                                                     
                                                     <th>
                                                        Date
                                                    </th>
                                                    <th>
                                                        Branch
                                                    </th>

                                                    <th>
                                                        Movie
                                                    </th>

                                                    <th>
                                                        Customer
                                                    </th>

                                                    <th>
                                                        Showtime
                                                    </th>

                                                    <th>
                                                        Seats
                                                    </th>

                                                    <th>
                                                        Amount
                                                    </th>

                                                    <th>
                                                        Payment
                                                    </th>

                                                    <th>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {filteredReportBookings.map(
                                                    (
                                                        booking,
                                                        index
                                                    ) => {

                                                        const schedule =
                                                            getSchedule(
                                                                booking
                                                            );

                                                        const branch =
                                                            getBranch(
                                                                booking
                                                            );

                                                        const movie =
                                                            getMovie(
                                                                booking
                                                            );

                                                        const seats =
                                                            getSelectedSeats(
                                                                booking
                                                            );

                                                        const bookingDate =
                                                            booking.showDate ||
                                                            schedule?.showDate ||
                                                            "N/A";

                                                        const startTime =
                                                            schedule?.startTime ||
                                                            booking.startTime ||
                                                            "N/A";

                                                        return (
                                                            <tr
                                                                key={
                                                                    booking._id ||
                                                                    booking.bookingID ||
                                                                    index
                                                                }
                                                            >
                                                                
                                                                <td>
                                                                    {
                                                                        bookingDate
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        branch?.branchName ||
                                                                        booking.branchName ||
                                                                        "Unknown"
                                                                    }
                                                                </td>

                                                                <td className="font-semibold">
                                                                    {
                                                                        movie?.title ||
                                                                        booking.movieTitle ||
                                                                        "Unknown"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    <div className="font-semibold">
                                                                        {
                                                                            booking.customerName ||
                                                                            "Unknown Customer"
                                                                        }
                                                                    </div>

                                                                    <div className="text-xs text-base-content/60">
                                                                        {
                                                                            booking.customerEmail ||
                                                                            ""
                                                                        }
                                                                    </div>
                                                                </td>
                                                               
                                                                <td>
                                                                    {
                                                                        startTime
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        seats.length
                                                                    }
                                                                </td>

                                                                <td className="font-semibold">
                                                                    ৳
                                                                    {
                                                                        booking.totalAmount ||
                                                                        0
                                                                    }
                                                                </td>

                                                                <td className="capitalize">
                                                                    {
                                                                        booking.paymentMethod ||
                                                                        "N/A"
                                                                    }
                                                                </td>

                                                                <td>
                                                                    <span
                                                                        className={
                                                                            booking.status ===
                                                                            "Confirmed"
                                                                                ? "badge badge-success"
                                                                                : booking.status ===
                                                                                  "Cancelled"
                                                                                ? "badge badge-error"
                                                                                : "badge badge-warning"
                                                                        }
                                                                    >
                                                                        {
                                                                            booking.status ||
                                                                            "Unknown"
                                                                        }
                                                                    </span>
                                                                </td>

                                                            </tr>
                                                        );
                                                    }
                                                )}

                                            </tbody>

                                        </table>

                                    ) : (

                                        <div className="text-center py-10 bg-base-200 rounded-lg">

                                            <FaChartBar className="text-4xl mx-auto text-base-content/30" />

                                            <h3 className="text-lg font-bold mt-3">
                                                No Booking Data Found
                                            </h3>

                                            <p className="text-sm text-base-content/60 mt-1">
                                                No bookings were found for the selected date and filters.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>
                        )}

                    </div>
                </div>

                <div className="card bg-base-100 shadow-md mb-8">

                    <div className="card-body">

                        <div className="flex items-center gap-3 mb-2">

                            <FaFilm className="text-primary text-xl" />

                            <h2 className="text-2xl font-bold">
                                Movie-wise Report
                            </h2>

                        </div>

                        <p className="text-sm text-base-content/60">
                            Booking and revenue information for each movie.
                        </p>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">

                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Movie</th>
                                        <th>Bookings</th>
                                        <th>Seats</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-8"
                                            >
                                                <span className="loading loading-spinner loading-md"></span>
                                            </td>
                                        </tr>

                                    ) : movieReport.length > 0 ? (

                                        movieReport.map(
                                            (movie) => (
                                                <tr
                                                    key={
                                                        movie.movieID
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            movie.movieID
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        {
                                                            movie.title
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            movie.bookings
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            movie.seats
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        ৳
                                                        {
                                                            movie.revenue
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center py-8 text-base-content/60"
                                            >
                                                No movie data available.
                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                <div className="card bg-base-100 shadow-md mb-8">

                    <div className="card-body">

                        <div className="flex items-center gap-3 mb-2">

                            <FaBuilding className="text-primary text-xl" />

                            <h2 className="text-2xl font-bold">
                                Cinema-wise Report
                            </h2>

                        </div>

                        <p className="text-sm text-base-content/60">
                            Booking and revenue information for each cinema branch.
                        </p>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">

                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>Cinema Branch</th>
                                        <th>Bookings</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center py-8"
                                            >
                                                <span className="loading loading-spinner loading-md"></span>
                                            </td>
                                        </tr>

                                    ) : branchReport.length > 0 ? (

                                        branchReport.map(
                                            (branch) => (
                                                <tr
                                                    key={
                                                        branch.branchID
                                                    }
                                                >

                                                    <td className="font-semibold">
                                                        {
                                                            branch.branchName
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            branch.bookings
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        ৳
                                                        {
                                                            branch.revenue
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center py-8 text-base-content/60"
                                            >
                                                No cinema data available.
                                            </td>
                                        </tr>

                                    )}

                                    {!loading &&
                                        unknownBranchBookings.length >
                                            0 && (

                                        <tr>

                                            <td className="font-semibold text-warning">
                                                Unknown Branch
                                            </td>

                                            <td>
                                                {
                                                    unknownBranchBookings.length
                                                }
                                            </td>

                                            <td className="font-semibold">
                                                ৳
                                                {
                                                    unknownBranchRevenue
                                                }
                                            </td>

                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                <div className="card bg-base-100 shadow-md">

                    <div className="card-body">

                        <div className="flex items-center gap-3 mb-2">

                            <FaCreditCard className="text-primary text-xl" />

                            <h2 className="text-2xl font-bold">
                                Payment Method Report
                            </h2>

                        </div>

                        <p className="text-sm text-base-content/60">
                            Booking and revenue information by payment method.
                        </p>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">

                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>Payment Method</th>
                                        <th>Bookings</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {paymentReport.map(
                                        (payment) => (
                                            <tr
                                                key={
                                                    payment.method
                                                }
                                            >

                                                <td className="font-semibold capitalize">
                                                    {
                                                        payment.method
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.bookings
                                                    }
                                                </td>

                                                <td className="font-semibold">
                                                    ৳
                                                    {
                                                        payment.revenue
                                                    }
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {!loading &&
                    totalBookings === 0 && (

                    <div className="card bg-base-100 shadow-md mt-8">

                        <div className="card-body text-center py-12">

                            <FaChartBar className="text-6xl mx-auto text-base-content/30" />

                            <h2 className="text-2xl font-bold mt-4">
                                No Booking Data Available
                            </h2>

                            <p className="text-base-content/60 mt-2">
                                Reports will be generated automatically
                                after customers complete bookings.
                            </p>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default Reports;