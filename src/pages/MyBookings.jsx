import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaTicketAlt,
    FaEye,
    FaTimes,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaPercentage,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function MyBookings() {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [cancellingBookingID, setCancellingBookingID] =
        useState(null);

    useEffect(() => {

        const loadBookings = async () => {

            try {

                const loggedInUser =
                    JSON.parse(
                        sessionStorage.getItem("user")
                    );

                if (!loggedInUser?.userID) {

                    setBookings([]);

                    setLoading(false);

                    return;

                }

                const response =
                    await fetch(
                        `${API_URL}/bookings/customer/${loggedInUser.userID}`
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load bookings"
                    );

                }

                setBookings(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error loading bookings:",
                    error
                );

                setBookings([]);

            } finally {

                setLoading(false);

            }

        };

        loadBookings();

    }, []);

    const getBookingStatus =
        (booking) => {

            return (
                booking.status ||
                "Confirmed"
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
                Number(parts[0]);

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

    const handleCancelBooking =
        async (bookingID) => {

            const confirmCancel =
                window.confirm(
                    "Are you sure you want to cancel this booking?"
                );

            if (!confirmCancel) {

                return;

            }

            if (!bookingID) {

                return;

            }

            setCancellingBookingID(
                bookingID
            );

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
                        "Booking cancellation failed"
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

                alert(
                    "Booking cancelled successfully. Your seats have been released."
                );

            } catch (error) {

                console.error(
                    "Booking cancellation failed:",
                    error
                );

                alert(
                    error.message ||
                    "Something went wrong while cancelling the booking."
                );

            } finally {

                setCancellingBookingID(
                    null
                );

            }

        };

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading your bookings...
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[95%] max-w-7xl mx-auto">

                <Link
                    to="/movies"
                    className="btn btn-ghost btn-sm mb-6"
                >

                    <FaArrowLeft />

                    Back to Movies

                </Link>

                <div className="mb-10">

                    <p className="text-primary font-semibold text-sm">
                        CUSTOMER ACCOUNT
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        My Bookings
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        View and manage your movie bookings.
                    </p>

                </div>

                {bookings.length > 0 ? (

                    <div className="space-y-6">

                        {bookings.map(
                            (booking) => {

                                const bookingStatus =
                                    getBookingStatus(
                                        booking
                                    );

                                const selectedSeats =
                                    getSelectedSeats(
                                        booking
                                    );

                                const isCancelled =
                                    bookingStatus ===
                                    "Cancelled";

                                const subtotal =
                                    Number(
                                        booking.subtotal ??
                                        (
                                            selectedSeats.length *
                                            Number(
                                                booking.ticketPrice ||
                                                0
                                            )
                                        )
                                    );

                                const discountAmount =
                                    Number(
                                        booking.discountAmount ||
                                        0
                                    );

                                const finalAmount =
                                    Number(
                                        booking.totalAmount ||
                                        Math.max(
                                            0,
                                            subtotal -
                                            discountAmount
                                        )
                                    );

                                const promotionCode =
                                    booking.promotionCode ||
                                    "";

                                const discountPercentage =
                                    Number(
                                        booking.discountPercentage ||
                                        0
                                    );

                                const bookingID =
                                    booking._id ||
                                    booking.bookingID;

                                return (

                                    <div
                                        key={
                                            bookingID
                                        }
                                        className="card bg-base-100 shadow-md"
                                    >

                                        <div className="card-body">

                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <div className="bg-primary/10 text-primary p-3 rounded-lg">

                                                            <FaTicketAlt className="text-2xl" />

                                                        </div>

                                                        <div>

                                                            <p className="text-sm text-base-content/60">
                                                                Booking ID
                                                            </p>

                                                            <h2 className="text-xl font-bold break-all">
                                                                {
                                                                    bookingID
                                                                }
                                                            </h2>

                                                        </div>

                                                    </div>

                                                </div>

                                                <span
                                                    className={`badge ${
                                                        isCancelled
                                                            ? "badge-error"
                                                            : "badge-success"
                                                    } badge-lg`}
                                                >
                                                    {
                                                        bookingStatus
                                                    }
                                                </span>

                                            </div>

                                            <div className="divider"></div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Movie
                                                    </p>

                                                    <p className="font-bold text-lg mt-1">
                                                        {
                                                            booking.movieTitle ||
                                                            "Unknown Movie"
                                                        }
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Cinema
                                                    </p>

                                                    <div className="flex items-start gap-2 mt-1">

                                                        <FaMapMarkerAlt className="text-primary mt-1" />

                                                        <div>

                                                            <p className="font-semibold">
                                                                {
                                                                    booking.branchName ||
                                                                    "Unknown Branch"
                                                                }
                                                            </p>

                                                            <p className="text-sm text-base-content/60">
                                                                {
                                                                    booking.location ||
                                                                    "Not available"
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Screen
                                                    </p>

                                                    <p className="font-semibold mt-1">
                                                        {
                                                            booking.screenName ||
                                                            "Unknown Screen"
                                                        }
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Date
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-1">

                                                        <FaCalendarAlt className="text-primary" />

                                                        <p className="font-semibold">
                                                            {
                                                                booking.showDate ||
                                                                "Not available"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Showtime
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-1">

                                                        <FaClock className="text-primary" />

                                                        <p className="font-semibold">

                                                            {
                                                                formatTime(
                                                                    booking.startTime
                                                                )
                                                            }

                                                            {" - "}

                                                            {
                                                                formatTime(
                                                                    booking.endTime
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Seats
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {selectedSeats.length >
                                                        0
                                                            ? selectedSeats.map(
                                                                (
                                                                    seat
                                                                ) => (

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
                                                            )
                                                            : (
                                                                <span className="text-sm">
                                                                    No seats
                                                                </span>
                                                            )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="divider"></div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Payment
                                                    </p>

                                                    <p className="font-semibold capitalize">
                                                        {
                                                            booking.paymentMethod ||
                                                            "Not available"
                                                        }
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Transaction ID
                                                    </p>

                                                    <p className="font-semibold text-sm break-all">
                                                        {
                                                            booking.transactionID ||
                                                            "Not available"
                                                        }
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Subtotal
                                                    </p>

                                                    <p className="text-lg font-bold">
                                                        ৳{subtotal}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Total Amount
                                                    </p>

                                                    <p className="text-2xl font-bold text-primary">
                                                        ৳{finalAmount}
                                                    </p>

                                                </div>

                                            </div>

                                            {promotionCode && (

                                                <div className="mt-6">

                                                    <div className="alert alert-success">

                                                        <FaPercentage />

                                                        <div className="w-full">

                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                                                                <div>

                                                                    <p className="font-bold">
                                                                        Promotion Applied
                                                                    </p>

                                                                    <p className="text-sm mt-1">

                                                                        Code:

                                                                        {" "}

                                                                        <span className="font-bold">
                                                                            {
                                                                                promotionCode
                                                                            }
                                                                        </span>

                                                                    </p>

                                                                </div>

                                                                <div className="text-left sm:text-right">

                                                                    <p className="font-bold">

                                                                        {
                                                                            discountPercentage
                                                                        }
                                                                        % OFF

                                                                    </p>

                                                                    <p className="text-sm">

                                                                        You saved ৳
                                                                        {
                                                                            discountAmount
                                                                        }

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}

                                            {!promotionCode &&
                                                discountAmount >
                                                0 && (

                                                <div className="mt-6">

                                                    <div className="alert alert-success">

                                                        <FaPercentage />

                                                        <div>

                                                            <p className="font-bold">
                                                                Discount Applied
                                                            </p>

                                                            <p className="text-sm">

                                                                You saved ৳
                                                                {
                                                                    discountAmount
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}

                                            <div className="divider"></div>

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                                                <div>

                                                    <p className="text-sm text-base-content/60">
                                                        Final Amount Paid
                                                    </p>

                                                    <p className="text-3xl font-bold text-primary">
                                                        ৳{finalAmount}
                                                    </p>

                                                </div>

                                                <div className="flex gap-3">

                                                    {!isCancelled && (

                                                        <Link
                                                            to={`/ticket?booking=${bookingID}`}
                                                            className="btn btn-primary"
                                                        >

                                                            <FaEye />

                                                            View Ticket

                                                        </Link>

                                                    )}

                                                    {!isCancelled && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    bookingID
                                                                )
                                                            }
                                                            disabled={
                                                                cancellingBookingID ===
                                                                bookingID
                                                            }
                                                            className="btn btn-outline btn-error"
                                                        >

                                                            <FaTimes />

                                                            {cancellingBookingID ===
                                                            bookingID
                                                                ? "Cancelling..."
                                                                : "Cancel"
                                                            }

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                ) : (

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body text-center py-20">

                            <FaTicketAlt className="text-6xl mx-auto text-base-content/30" />

                            <h2 className="text-2xl font-bold mt-5">
                                No Bookings Found
                            </h2>

                            <p className="text-base-content/60 mt-2">
                                You have not made any movie bookings yet.
                            </p>

                            <Link
                                to="/movies"
                                className="btn btn-primary mt-6"
                            >
                                Browse Movies
                            </Link>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyBookings;