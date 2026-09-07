import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    FaCheckCircle,
    FaTicketAlt,
    FaHome,
    FaDownload,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function Ticket() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const [booking, setBooking] =
        useState(null);

    const [ticket, setTicket] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {

        const loadTicketData =
            async () => {

                try {

                    setLoading(true);
                    setErrorMessage("");

                    const bookingID =
                        searchParams.get(
                            "booking"
                        );

                    if (!bookingID) {

                        setErrorMessage(
                            "Booking information was not found."
                        );

                        return;

                    }

                    const bookingResponse =
                        await fetch(
                            `${API_URL}/bookings/${bookingID}`
                        );

                    const bookingData =
                        await bookingResponse.json();

                    if (!bookingResponse.ok) {

                        throw new Error(
                            bookingData.message ||
                            "Failed to load booking information."
                        );

                    }

                    setBooking(
                        bookingData
                    );

                    const ticketResponse =
                        await fetch(
                            `${API_URL}/bookings/${bookingID}/ticket`
                        );

                    const ticketData =
                        await ticketResponse.json();

                    if (!ticketResponse.ok) {

                        throw new Error(
                            ticketData.message ||
                            "Ticket not found."
                        );

                    }

                    setTicket(
                        ticketData
                    );

                } catch (error) {

                    console.error(
                        "Failed to load ticket data:",
                        error
                    );

                    setErrorMessage(
                        error.message ||
                        "Failed to load ticket information."
                    );

                } finally {

                    setLoading(false);

                }

            };

        loadTicketData();

    }, [searchParams]);

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="text-center">

                    <FaTicketAlt className="text-primary text-6xl mx-auto mb-5" />

                    <h1 className="text-3xl font-bold">
                        Loading Ticket...
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        Fetching your ticket information.
                    </p>

                    <span className="loading loading-spinner loading-lg text-primary mt-5"></span>

                </div>

            </div>

        );

    }

    if (
        !booking ||
        !ticket
    ) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="text-center">

                    <FaTicketAlt className="text-primary text-6xl mx-auto mb-5" />

                    <h1 className="text-3xl font-bold">
                        Ticket Information Not Found
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        {
                            errorMessage ||
                            "Please complete a movie booking and payment first."
                        }
                    </p>

                    <Link
                        to="/movies"
                        className="btn btn-primary mt-6"
                    >
                        Browse Movies
                    </Link>

                </div>

            </div>

        );

    }

    const movieTitle =
        ticket.movieTitle ||
        booking.movieTitle ||
        "Movie";

    const branchName =
        ticket.branchName ||
        booking.branchName ||
        "Not available";

    const location =
        ticket.location ||
        booking.location ||
        "Not available";

    const screenName =
        ticket.screenName ||
        booking.screenName ||
        "Not available";

    const showDate =
        ticket.showDate ||
        booking.showDate ||
        "Not available";

    const startTime =
        ticket.startTime ||
        booking.startTime ||
        "Not available";

    const endTime =
        ticket.endTime ||
        booking.endTime ||
        "Not available";

    const selectedSeats =
        ticket.seatIDs ||
        booking.selectedSeats ||
        [];

    const numberOfSeats =
        ticket.numberOfSeats ||
        selectedSeats.length;

    const ticketPrice =
        ticket.ticketPrice ||
        booking.ticketPrice ||
        0;

    const subtotal =
        ticket.subtotal !== undefined
            ? ticket.subtotal
            : booking.subtotal !== undefined
                ? booking.subtotal
                : selectedSeats.length *
                  Number(ticketPrice);

    const discountAmount =
        ticket.discountAmount !== undefined
            ? ticket.discountAmount
            : booking.discountAmount !== undefined
                ? booking.discountAmount
                : 0;

    const promotionCode =
        ticket.promotionCode ||
        booking.promotionCode ||
        "";

    const discountPercentage =
        ticket.discountPercentage !== undefined
            ? ticket.discountPercentage
            : booking.discountPercentage !== undefined
                ? booking.discountPercentage
                : 0;

    const totalAmount =
        ticket.totalAmount !== undefined
            ? ticket.totalAmount
            : booking.totalAmount !== undefined
                ? booking.totalAmount
                : 0;

    const paymentMethod =
        ticket.paymentMethod ||
        booking.paymentMethod ||
        "Not available";

    const transactionID =
        ticket.transactionID ||
        booking.transactionID ||
        "Not available";

    const ticketID =
        ticket.ticketID ||
        "Not available";

    const bookingID =
        ticket.bookingID ||
        booking._id ||
        "Not available";

    const handleDownloadTicket =
        () => {

            window.print();

        };

    const handleFinish =
        () => {

            navigate("/");

        };

    return (

        <div className="ticket-page min-h-screen bg-base-200 py-10">

            <div className="ticket-container w-[90%] max-w-3xl mx-auto">

                <div className="text-center mb-8 no-print">

                    <FaCheckCircle
                        className="text-success text-6xl mx-auto"
                    />

                    <h1 className="text-4xl font-bold mt-4">
                        Booking Confirmed
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Your movie ticket has been generated successfully.
                    </p>

                </div>

                <div
                    id="movie-ticket"
                    className="card bg-base-100 shadow-xl"
                >

                    <div className="card-body p-8">

                        <div className="text-center">

                            <div className="flex justify-center items-center gap-2">

                                <FaTicketAlt
                                    className="text-primary text-3xl"
                                />

                                <h2 className="text-3xl font-bold">
                                    MovieBook
                                </h2>

                            </div>

                            <p className="text-base-content/60 mt-2">
                                Movie Ticket
                            </p>

                        </div>

                        <div className="divider"></div>

                        <div className="text-center">

                            <p className="text-sm text-base-content/60">
                                MOVIE
                            </p>

                            <h2 className="text-3xl font-bold mt-1">
                                {movieTitle}
                            </h2>

                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Cinema
                                </p>

                                <p className="font-semibold text-lg">
                                    {branchName}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Location
                                </p>

                                <p className="font-semibold text-lg">
                                    {location}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Screen
                                </p>

                                <p className="font-semibold text-lg">
                                    {screenName}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Date
                                </p>

                                <p className="font-semibold text-lg">
                                    {showDate}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Showtime
                                </p>

                                <p className="font-semibold text-lg">
                                    {startTime}
                                    {" - "}
                                    {endTime}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Payment Method
                                </p>

                                <p className="font-semibold text-lg capitalize">
                                    {paymentMethod}
                                </p>

                            </div>

                        </div>

                        <div className="divider"></div>

                        <div>

                            <p className="text-sm text-base-content/60">
                                Selected Seats
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">

                                {selectedSeats.map(
                                    (seat) => (

                                        <span
                                            key={seat}
                                            className="badge badge-primary badge-lg"
                                        >
                                            {seat}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Number of Seats
                                </p>

                                <p className="font-semibold text-lg">
                                    {numberOfSeats}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Ticket Price
                                </p>

                                <p className="font-semibold text-lg">
                                    ৳{ticketPrice}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Booking ID
                                </p>

                                <p className="font-semibold break-all">
                                    {bookingID}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Transaction ID
                                </p>

                                <p className="font-semibold break-all">
                                    {transactionID}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Ticket ID
                                </p>

                                <p className="font-semibold break-all">
                                    {ticketID}
                                </p>

                            </div>

                        </div>

                        <div className="divider"></div>

                        <div>

                            <div className="flex justify-between items-center">

                                <span>
                                    Subtotal
                                </span>

                                <span className="font-semibold">
                                    ৳{subtotal}
                                </span>

                            </div>

                            {promotionCode &&
                                discountAmount > 0 && (

                                    <div className="flex justify-between items-center mt-3 text-success">

                                        <div>

                                            <span>
                                                Promotion
                                            </span>

                                            <span className="badge badge-success badge-sm ml-2">
                                                {promotionCode}
                                            </span>

                                        </div>

                                        <span className="font-semibold">
                                            -৳{discountAmount}
                                        </span>

                                    </div>

                                )}

                            {promotionCode &&
                                discountPercentage > 0 && (

                                    <p className="text-sm text-success mt-2">
                                        {discountPercentage}% discount applied
                                    </p>

                                )}

                        </div>

                        <div className="divider"></div>

                        <div className="flex justify-between items-center">

                            <span className="text-xl font-bold">
                                Total Paid
                            </span>

                            <span className="text-3xl font-bold text-primary">
                                ৳{totalAmount}
                            </span>

                        </div>

                        <div className="alert alert-success mt-6">

                            <FaCheckCircle />

                            <div>

                                <h3 className="font-bold">
                                    Payment Confirmed
                                </h3>

                                <p className="text-sm">
                                    Your booking has been successfully
                                    confirmed and your movie ticket has
                                    been generated.
                                </p>

                            </div>

                        </div>

                        <div className="flex flex-col md:flex-row gap-3 mt-6 no-print">

                            <button
                                type="button"
                                onClick={
                                    handleDownloadTicket
                                }
                                className="btn btn-outline flex-1"
                            >

                                <FaDownload />

                                Download Ticket

                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleFinish
                                }
                                className="btn btn-primary flex-1"
                            >

                                <FaHome />

                                Back to Home

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <style>
                {`

                    @page {
                        size: A4;
                        margin: 5mm;
                    }

                    @media print {

                        html,
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            height: auto !important;
                            min-height: 0 !important;
                            background: white !important;
                        }

                        body {
                            overflow: visible !important;
                        }

                        .ticket-page {
                            min-height: 0 !important;
                            height: auto !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            background: white !important;
                        }

                        .ticket-container {
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        body * {
                            visibility: hidden;
                        }

                        #movie-ticket,
                        #movie-ticket * {
                            visibility: visible;
                        }

                        #movie-ticket {
                            position: relative !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                            background: white !important;
                            zoom: 0.82;
                        }

                        #movie-ticket .card-body {
                            padding: 18px !important;
                        }

                        #movie-ticket .divider {
                            margin-top: 8px !important;
                            margin-bottom: 8px !important;
                        }

                        #movie-ticket .grid {
                            gap: 8px !important;
                        }

                        #movie-ticket .mt-8 {
                            margin-top: 10px !important;
                        }

                        #movie-ticket .mt-6 {
                            margin-top: 8px !important;
                        }

                        #movie-ticket .mt-3 {
                            margin-top: 4px !important;
                        }

                        #movie-ticket .mt-2 {
                            margin-top: 2px !important;
                        }

                        #movie-ticket .mt-1 {
                            margin-top: 1px !important;
                        }

                        #movie-ticket h2 {
                            font-size: 22px !important;
                            line-height: 1.2 !important;
                        }

                        #movie-ticket .text-3xl {
                            font-size: 22px !important;
                        }

                        #movie-ticket .text-xl {
                            font-size: 17px !important;
                        }

                        #movie-ticket .text-lg {
                            font-size: 13px !important;
                        }

                        #movie-ticket .text-sm {
                            font-size: 10px !important;
                            line-height: 1.3 !important;
                        }

                        #movie-ticket .badge {
                            font-size: 10px !important;
                            padding: 4px 8px !important;
                        }

                        #movie-ticket .alert {
                            padding: 7px !important;
                            margin-top: 8px !important;
                        }

                        #movie-ticket p {
                            margin-bottom: 0 !important;
                        }

                        #movie-ticket .font-semibold {
                            line-height: 1.3 !important;
                        }

                    }

                `}
            </style>

        </div>

    );

}

export default Ticket;