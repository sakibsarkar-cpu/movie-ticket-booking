import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaTicketAlt,
    FaChartBar,
    FaMoneyBillWave,
    FaUsers,
    FaEye,
    FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function ManageBookings() {

    const [bookings, setBookings] =
        useState([]);

    const [movies, setMovies] =
        useState([]);

    const [branches, setBranches] =
        useState([]);

    const [screens, setScreens] =
        useState([]);

    const [schedules, setSchedules] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isCancelling, setIsCancelling] =
        useState(false);

    useEffect(() => {

        const loadData = async () => {

            try {

                setIsLoading(true);
                setErrorMessage("");

                const [
                    bookingsResponse,
                    moviesResponse,
                    branchesResponse,
                    screensResponse,
                    schedulesResponse,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/bookings`
                    ),
                    fetch(
                        `${API_URL}/movies`
                    ),
                    fetch(
                        `${API_URL}/branches`
                    ),
                    fetch(
                        `${API_URL}/screens`
                    ),
                    fetch(
                        `${API_URL}/schedules`
                    ),
                ]);

                const [
                    bookingsData,
                    moviesData,
                    branchesData,
                    screensData,
                    schedulesData,
                ] = await Promise.all([
                    bookingsResponse.json(),
                    moviesResponse.json(),
                    branchesResponse.json(),
                    screensResponse.json(),
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
                        "Failed to load branches."
                    );
                }

                if (!screensResponse.ok) {
                    throw new Error(
                        screensData.message ||
                        "Failed to load screens."
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

                setScreens(
                    Array.isArray(screensData)
                        ? screensData
                        : []
                );

                setSchedules(
                    Array.isArray(schedulesData)
                        ? schedulesData
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load booking data:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to load booking data."
                );

                setBookings([]);

            } finally {

                setIsLoading(false);

            }

        };

        loadData();

    }, []);

    const getMovie =
        (movieID) => {

            return movies.find(
                (movie) =>
                    Number(
                        movie.movieID
                    ) ===
                    Number(movieID)
            );

        };

    const getBranchByID =
        (branchID) => {

            return branches.find(
                (branch) =>
                    Number(
                        branch.branchID
                    ) ===
                    Number(branchID)
            );

        };

    const getScreenByID =
        (screenID) => {

            return screens.find(
                (screen) =>
                    Number(
                        screen.screenID
                    ) ===
                    Number(screenID)
            );

        };

    const getSchedule =
        (
            movieID,
            scheduleID
        ) => {

            return schedules.find(
                (schedule) =>
                    Number(
                        schedule.scheduleID
                    ) ===
                        Number(scheduleID) &&
                    (
                        movieID === undefined ||
                        Number(
                            schedule.movieID
                        ) ===
                            Number(movieID)
                    )
            );

        };

    const getBookingSchedule =
        (booking) => {

            return getSchedule(
                booking.movieID,
                booking.scheduleID
            );

        };

    const getBookingBranch =
        (booking) => {

            const schedule =
                getBookingSchedule(
                    booking
                );

            const branchID =
                booking.branchID !==
                    undefined &&
                booking.branchID !==
                    null &&
                booking.branchID !== ""
                    ? booking.branchID
                    : schedule?.branchID;

            if (
                branchID !== undefined &&
                branchID !== null &&
                branchID !== ""
            ) {

                const branch =
                    getBranchByID(
                        branchID
                    );

                if (branch) {

                    return branch;

                }

            }

            if (booking.branchName) {

                return branches.find(
                    (branch) =>
                        branch.branchName ===
                        booking.branchName
                );

            }

            return null;

        };

    const getBookingScreen =
        (booking) => {

            const schedule =
                getBookingSchedule(
                    booking
                );

            const branch =
                getBookingBranch(
                    booking
                );

            const screenID =
                booking.screenID !==
                    undefined &&
                booking.screenID !==
                    null &&
                booking.screenID !== ""
                    ? booking.screenID
                    : schedule?.screenID;

            const branchID =
                branch?.branchID !==
                    undefined
                    ? branch.branchID
                    : booking.branchID !==
                          undefined &&
                      booking.branchID !==
                          null &&
                      booking.branchID !== ""
                        ? booking.branchID
                        : schedule?.branchID;

            if (
                screenID === undefined ||
                screenID === null ||
                screenID === "" ||
                branchID === undefined ||
                branchID === null ||
                branchID === ""
            ) {

                return null;

            }

            return screens.find(
                (screen) =>
                    Number(
                        screen.screenID
                    ) ===
                        Number(screenID) &&
                    Number(
                        screen.branchID
                    ) ===
                        Number(branchID)
            );

        };

    const getMovieTitle =
        (booking) => {

            const movie =
                getMovie(
                    booking.movieID
                );

            return (
                movie?.title ||
                booking.movieTitle ||
                "Unknown Movie"
            );

        };

    const getBranchName =
        (booking) => {

            const branch =
                getBookingBranch(
                    booking
                );

            return (
                branch?.branchName ||
                booking.branchName ||
                "Unknown Branch"
            );

        };

    const getBranchLocation =
        (booking) => {

            const branch =
                getBookingBranch(
                    booking
                );

            return (
                branch?.location ||
                booking.location ||
                "Not available"
            );

        };

    const getScreenName =
        (booking) => {

            const screen =
                getBookingScreen(
                    booking
                );

            const schedule =
                getBookingSchedule(
                    booking
                );

            return (
                screen?.screenName ||
                booking.screenName ||
                schedule?.screenName ||
                "Unknown Screen"
            );

        };

    const getShowDate =
        (booking) => {

            const schedule =
                getBookingSchedule(
                    booking
                );

            return (
                booking.showDate ||
                schedule?.showDate ||
                "Not available"
            );

        };

    const getStartTime =
        (booking) => {

            const schedule =
                getBookingSchedule(
                    booking
                );

            return (
                booking.startTime ||
                schedule?.startTime ||
                ""
            );

        };

    const getEndTime =
        (booking) => {

            const schedule =
                getBookingSchedule(
                    booking
                );

            return (
                booking.endTime ||
                schedule?.endTime ||
                ""
            );

        };

    const formatTime =
        (time) => {

            if (!time) {

                return "";

            }

            if (
                time.includes("AM") ||
                time.includes("PM")
            ) {

                return time;

            }

            const parts =
                time.split(":");

            if (
                parts.length < 2
            ) {

                return time;

            }

            let hour =
                Number(
                    parts[0]
                );

            const minutes =
                parts[1];

            const period =
                hour >= 12
                    ? "PM"
                    : "AM";

            hour =
                hour % 12 || 12;

            return `${hour}:${minutes} ${period}`;

        };

    const getCustomerName =
        (booking) => {

            return (
                booking.customerName ||
                booking.userName ||
                booking.name ||
                booking.fullName ||
                "Unknown Customer"
            );

        };

    const getCustomerEmail =
        (booking) => {

            return (
                booking.customerEmail ||
                booking.userEmail ||
                booking.email ||
                "No email"
            );

        };

    const getSelectedSeats =
        (booking) => {

            if (
                Array.isArray(
                    booking.selectedSeats
                )
            ) {

                return booking.selectedSeats;

            }

            if (
                Array.isArray(
                    booking.seats
                )
            ) {

                return booking.seats;

            }

            return [];

        };

    const getPaymentMethod =
        (booking) => {

            return (
                booking.paymentMethod ||
                "Cash"
            );

        };

    const getPaymentStatus =
        (booking) => {

            return (
                booking.paymentStatus ||
                "Paid"
            );

        };

    const getBookingStatus =
        (booking) => {

            return (
                booking.status ||
                "Confirmed"
            );

        };

    const getBookingID =
        (booking) => {

            return (
                booking._id ||
                booking.bookingID ||
                "Not available"
            );

        };

    const totalBookings =
        bookings.length;

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                getBookingStatus(
                    booking
                ) === "Confirmed"
        ).length;

    const cancelledBookings =
        bookings.filter(
            (booking) =>
                getBookingStatus(
                    booking
                ) === "Cancelled"
        ).length;

    const totalRevenue =
        bookings
            .filter(
                (booking) =>
                    getBookingStatus(
                        booking
                    ) === "Confirmed"
            )
            .reduce(
                (
                    total,
                    booking
                ) =>
                    total +
                    Number(
                        booking.totalAmount ||
                        0
                    ),
                0
            );

    const totalCustomers =
        new Set(
            bookings.map(
                (booking) =>
                    getCustomerEmail(
                        booking
                    )
            )
        ).size;

    const filteredBookings =
        bookings.filter(
            (booking) => {

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();

                if (!search) {

                    return true;

                }

                const bookingID =
                    String(
                        getBookingID(
                            booking
                        )
                    ).toLowerCase();

                const movieTitle =
                    getMovieTitle(
                        booking
                    ).toLowerCase();

                const branchName =
                    getBranchName(
                        booking
                    ).toLowerCase();

                const customerName =
                    getCustomerName(
                        booking
                    ).toLowerCase();

                const customerEmail =
                    getCustomerEmail(
                        booking
                    ).toLowerCase();

                const seats =
                    getSelectedSeats(
                        booking
                    )
                        .join(" ")
                        .toLowerCase();

                const transactionID =
                    String(
                        booking.transactionID ||
                        ""
                    ).toLowerCase();

                return (
                    bookingID.includes(search) ||
                    movieTitle.includes(search) ||
                    branchName.includes(search) ||
                    customerName.includes(search) ||
                    customerEmail.includes(search) ||
                    seats.includes(search) ||
                    transactionID.includes(search)
                );

            }
        );

    const handleCancelBooking =
        async (bookingID) => {

            const confirmCancel =
                window.confirm(
                    "Are you sure you want to cancel this booking?"
                );

            if (!confirmCancel) {

                return;

            }

            if (isCancelling) {

                return;

            }

            setIsCancelling(true);

            try {

                const response =
                    await fetch(
                        `${API_URL}/bookings/${bookingID}/cancel`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Booking cancellation failed."
                    );

                }

                setBookings(
                    (currentBookings) =>
                        currentBookings.map(
                            (booking) =>
                                String(
                                    booking._id
                                ) ===
                                String(
                                    bookingID
                                )
                                    ? data.booking
                                    : booking
                        )
                );

                if (
                    selectedBooking &&
                    String(
                        selectedBooking._id
                    ) ===
                    String(
                        bookingID
                    )
                ) {

                    setSelectedBooking(
                        data.booking
                    );

                }

                alert(
                    "Booking cancelled successfully. The selected seats have been released."
                );

            } catch (error) {

                console.error(
                    "Booking cancellation failed:",
                    error
                );

                alert(
                    error.message ||
                    "Booking cancellation failed."
                );

            } finally {

                setIsCancelling(false);

            }

        };

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

                        <FaTicketAlt className="text-primary text-2xl" />

                        <div>

                            <p className="text-primary font-semibold text-sm">
                                ADMINISTRATION
                            </p>

                            <h1 className="text-3xl font-bold">
                                Manage Bookings
                            </h1>

                            <p className="text-base-content/60 mt-1">
                                View and manage customer movie bookings.
                            </p>

                        </div>

                    </div>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Total Bookings
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {totalBookings}
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
                                        Confirmed
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {confirmedBookings}
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
                                        Revenue
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        ৳{totalRevenue}
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
                                        Customers
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {totalCustomers}
                                    </p>

                                </div>

                                <FaUsers className="text-primary text-3xl" />

                            </div>

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

                <div className="card bg-base-100 shadow-md">

                    <div className="card-body">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Booking List
                                </h2>

                                <p className="text-sm text-base-content/60 mt-1">
                                    All customer movie bookings.
                                </p>

                            </div>

                            <div className="w-full md:w-96">

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={
                                        (event) =>
                                            setSearchTerm(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Search booking, movie, customer, seat..."
                                    className="input input-bordered w-full"
                                />

                            </div>

                        </div>

                        <div className="divider"></div>

                        {isLoading ? (

                            <div className="text-center py-16">

                                <span className="loading loading-spinner loading-lg"></span>

                                <p className="mt-4 text-base-content/60">
                                    Loading bookings...
                                </p>

                            </div>

                        ) : filteredBookings.length > 0 ? (

                            <div className="overflow-x-auto">

                                <table className="table w-full">

                                    <thead>

                                        <tr>

                                            <th>
                                                Booking ID
                                            </th>

                                            <th>
                                                Customer
                                            </th>

                                            <th>
                                                Movie
                                            </th>

                                            <th>
                                                Cinema
                                            </th>

                                            <th>
                                                Screen
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Time
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

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredBookings.map(
                                            (booking) => {

                                                const bookingStatus =
                                                    getBookingStatus(
                                                        booking
                                                    );

                                                const selectedSeats =
                                                    getSelectedSeats(
                                                        booking
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            booking._id
                                                        }
                                                    >

                                                        <td>

                                                            <span className="font-semibold text-xs">
                                                                {
                                                                    getBookingID(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div>

                                                                <p className="font-semibold">
                                                                    {
                                                                        getCustomerName(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-base-content/60">
                                                                    {
                                                                        getCustomerEmail(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span className="font-semibold">
                                                                {
                                                                    getMovieTitle(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div>

                                                                <p className="font-semibold">
                                                                    {
                                                                        getBranchName(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-base-content/60">
                                                                    {
                                                                        getBranchLocation(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span>
                                                                {
                                                                    getScreenName(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <span>
                                                                {
                                                                    getShowDate(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div>

                                                                <p>
                                                                    {
                                                                        formatTime(
                                                                            getStartTime(
                                                                                booking
                                                                            )
                                                                        )
                                                                    }
                                                                </p>

                                                                {getEndTime(
                                                                    booking
                                                                ) && (

                                                                    <p className="text-xs text-base-content/60">
                                                                        to{" "}
                                                                        {
                                                                            formatTime(
                                                                                getEndTime(
                                                                                    booking
                                                                                )
                                                                            )
                                                                        }
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <div className="flex flex-wrap gap-1">

                                                                {selectedSeats.map(
                                                                    (seat) => (

                                                                        <span
                                                                            key={
                                                                                seat
                                                                            }
                                                                            className="badge badge-primary"
                                                                        >
                                                                            {
                                                                                seat
                                                                            }
                                                                        </span>

                                                                    )
                                                                )}

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span className="font-semibold">
                                                                ৳
                                                                {
                                                                    booking.totalAmount ||
                                                                    0
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div>

                                                                <p className="font-semibold capitalize">
                                                                    {
                                                                        getPaymentMethod(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-base-content/60">
                                                                    {
                                                                        getPaymentStatus(
                                                                            booking
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`badge ${
                                                                    bookingStatus ===
                                                                    "Confirmed"
                                                                        ? "badge-success"
                                                                        : bookingStatus ===
                                                                          "Cancelled"
                                                                            ? "badge-error"
                                                                            : "badge-warning"
                                                                }`}
                                                            >
                                                                {
                                                                    bookingStatus
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <div className="flex gap-2">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedBooking(
                                                                            booking
                                                                        )
                                                                    }
                                                                    className="btn btn-sm btn-info"
                                                                >

                                                                    <FaEye />

                                                                    View

                                                                </button>

                                                                {bookingStatus ===
                                                                    "Confirmed" && (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleCancelBooking(
                                                                                booking._id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isCancelling
                                                                        }
                                                                        className="btn btn-sm btn-error"
                                                                    >

                                                                        <FaTimes />

                                                                        Cancel

                                                                    </button>

                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="text-center py-16">

                                <FaTicketAlt className="text-6xl mx-auto text-base-content/30" />

                                <h2 className="text-2xl font-bold mt-4">
                                    No Bookings Found
                                </h2>

                                <p className="text-base-content/60 mt-2">
                                    {searchTerm
                                        ? "Try searching with a different keyword."
                                        : "Customer bookings will appear here."
                                    }
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {selectedBooking && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="p-6">

                            <div className="flex justify-between items-center">

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        Booking Details
                                    </h2>

                                    <p className="text-sm text-base-content/60 mt-1">

                                        Booking ID:{" "}

                                        {
                                            getBookingID(
                                                selectedBooking
                                            )
                                        }

                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedBooking(
                                            null
                                        )
                                    }
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="divider"></div>

                            <div className="grid sm:grid-cols-2 gap-5">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Customer
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getCustomerName(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                    <p className="text-sm text-base-content/60">
                                        {
                                            getCustomerEmail(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                    <p className="text-sm text-base-content/60">
                                        {
                                            selectedBooking.customerPhone ||
                                            "No phone"
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Movie
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getMovieTitle(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Cinema
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getBranchName(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                    <p className="text-sm text-base-content/60">
                                        {
                                            getBranchLocation(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Screen
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getScreenName(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Date
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getShowDate(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Showtime
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            formatTime(
                                                getStartTime(
                                                    selectedBooking
                                                )
                                            )
                                        }

                                        {getEndTime(
                                            selectedBooking
                                        ) && (
                                            <>
                                                {" - "}
                                                {
                                                    formatTime(
                                                        getEndTime(
                                                            selectedBooking
                                                        )
                                                    )
                                                }
                                            </>
                                        )}

                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Seats
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-1">

                                        {getSelectedSeats(
                                            selectedBooking
                                        ).map(
                                            (seat) => (

                                                <span
                                                    key={
                                                        seat
                                                    }
                                                    className="badge badge-primary"
                                                >
                                                    {
                                                        seat
                                                    }
                                                </span>

                                            )
                                        )}

                                    </div>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Ticket Price
                                    </p>

                                    <p className="font-semibold">
                                        ৳
                                        {
                                            selectedBooking.ticketPrice ||
                                            0
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Subtotal
                                    </p>

                                    <p className="font-semibold">
                                        ৳
                                        {
                                            selectedBooking.subtotal ||
                                            0
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Promotion
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            selectedBooking.promotionCode ||
                                            "None"
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Discount
                                    </p>

                                    <p className="font-semibold text-success">
                                        -৳
                                        {
                                            selectedBooking.discountAmount ||
                                            0
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Payment Method
                                    </p>

                                    <p className="font-semibold capitalize">
                                        {
                                            getPaymentMethod(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Payment Status
                                    </p>

                                    <p className="font-semibold">
                                        {
                                            getPaymentStatus(
                                                selectedBooking
                                            )
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Transaction ID
                                    </p>

                                    <p className="font-semibold break-all">
                                        {
                                            selectedBooking.transactionID ||
                                            "Not available"
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Booking Status
                                    </p>

                                    <span
                                        className={`badge ${
                                            getBookingStatus(
                                                selectedBooking
                                            ) ===
                                            "Confirmed"
                                                ? "badge-success"
                                                : "badge-error"
                                        }`}
                                    >
                                        {
                                            getBookingStatus(
                                                selectedBooking
                                            )
                                        }
                                    </span>

                                </div>

                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between items-center">

                                <span className="text-lg font-semibold">
                                    Total Amount
                                </span>

                                <span className="text-2xl font-bold text-primary">
                                    ৳
                                    {
                                        selectedBooking.totalAmount ||
                                        0
                                    }
                                </span>

                            </div>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedBooking(
                                            null
                                        )
                                    }
                                    className="btn"
                                >
                                    Close
                                </button>

                                {getBookingStatus(
                                    selectedBooking
                                ) ===
                                    "Confirmed" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCancelBooking(
                                                selectedBooking._id
                                            )
                                        }
                                        disabled={
                                            isCancelling
                                        }
                                        className="btn btn-error"
                                    >

                                        <FaTimes />

                                        {isCancelling
                                            ? "Cancelling..."
                                            : "Cancel Booking"
                                        }

                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default ManageBookings;