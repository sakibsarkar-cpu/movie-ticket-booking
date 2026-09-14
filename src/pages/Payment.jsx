import bkashLogo from "../assets/bkash logo.webp";
import nagadLogo from "../assets/nagad logoo.png";
import upayLogo from "../assets/upay logo.webp";
import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import {
    FaArrowLeft,
    FaCreditCard,
    FaMobileAlt,
    FaMoneyBillWave,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRedo,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function Payment() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const movieID =
        Number(searchParams.get("movie"));

    const scheduleID =
        Number(searchParams.get("schedule"));

    const selectedSeats =
        (searchParams.get("seats") || "")
            .split(",")
            .map((seat) => seat.trim())
            .filter(Boolean);

    const [movie, setMovie] =
        useState(null);

    const [branches, setBranches] =
        useState([]);

    const [screens, setScreens] =
        useState([]);

    const [schedule, setSchedule] =
        useState(null);

    const [ticketPrices, setTicketPrices] =
        useState([]);

    const [promotions, setPromotions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState("");

    const [promotionCode, setPromotionCode] =
        useState("");

    const [
        showPromotionSuggestions,
        setShowPromotionSuggestions,
    ] = useState(false);

    const [
        appliedPromotion,
        setAppliedPromotion,
    ] = useState(null);

    const [
        discountAmount,
        setDiscountAmount,
    ] = useState(0);

    const [
        promotionMessage,
        setPromotionMessage,
    ] = useState("");

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState("card");

    const [
        mobileBankingProvider,
        setMobileBankingProvider,
    ] = useState("bkash");

    const [
        mobileBankingNumber,
        setMobileBankingNumber,
    ] = useState("");

    const [
        paymentSuccess,
        setPaymentSuccess,
    ] = useState(false);

    const [
        paymentFailed,
        setPaymentFailed,
    ] = useState(false);

    const [
        simulateFailure,
        setSimulateFailure,
    ] = useState(false);

    const [
        transactionID,
        setTransactionID,
    ] = useState("");

    const [
        isConfirmingBooking,
        setIsConfirmingBooking,
    ] = useState(false);

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setLoadError("");

                const [
                    movieResponse,
                    branchResponse,
                    screenResponse,
                    scheduleResponse,
                    ticketPriceResponse,
                    promotionResponse,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/movies/${movieID}`
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
                    fetch(
                        `${API_URL}/ticket-prices`
                    ),
                    fetch(
                        `${API_URL}/promotions`
                    ),
                ]);

                const [
                    movieData,
                    branchData,
                    screenData,
                    scheduleData,
                    ticketPriceData,
                    promotionData,
                ] = await Promise.all([
                    movieResponse.json(),
                    branchResponse.json(),
                    screenResponse.json(),
                    scheduleResponse.json(),
                    ticketPriceResponse.json(),
                    promotionResponse.json(),
                ]);

                if (!movieResponse.ok) {
                    throw new Error(
                        movieData.message ||
                        "Movie not found."
                    );
                }

                if (!branchResponse.ok) {
                    throw new Error(
                        branchData.message ||
                        "Failed to load cinema branches."
                    );
                }

                if (!screenResponse.ok) {
                    throw new Error(
                        screenData.message ||
                        "Failed to load screens."
                    );
                }

                if (!scheduleResponse.ok) {
                    throw new Error(
                        scheduleData.message ||
                        "Failed to load schedules."
                    );
                }

                if (!ticketPriceResponse.ok) {
                    throw new Error(
                        ticketPriceData.message ||
                        "Failed to load ticket prices."
                    );
                }

                if (!promotionResponse.ok) {
                    throw new Error(
                        promotionData.message ||
                        "Failed to load promotions."
                    );
                }

                const selectedSchedule =
                    Array.isArray(scheduleData)
                        ? scheduleData.find(
                            (item) =>
                                Number(
                                    item.scheduleID
                                ) ===
                                    scheduleID &&
                                Number(
                                    item.movieID
                                ) ===
                                    movieID
                        )
                        : null;

                setMovie({
                    ...movieData,
                    genre:
                        movieData.genreName ||
                        "",
                });

                setBranches(
                    Array.isArray(branchData)
                        ? branchData
                        : []
                );

                setScreens(
                    Array.isArray(screenData)
                        ? screenData
                        : []
                );

                setSchedule(
                    selectedSchedule
                );

                setTicketPrices(
                    Array.isArray(
                        ticketPriceData
                    )
                        ? ticketPriceData.map(
                            (price) => ({
                                ...price,
                                movieID:
                                    Number(
                                        price.movieID
                                    ),
                                branchID:
                                    Number(
                                        price.branchID
                                    ),
                                screenID:
                                    Number(
                                        price.screenID
                                    ),
                                price:
                                    Number(
                                        price.price
                                    ),
                            })
                        )
                        : []
                );

                setPromotions(
                    Array.isArray(
                        promotionData
                    )
                        ? promotionData
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load payment data:",
                    error
                );

                setLoadError(
                    error.message ||
                    "Failed to load payment information."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [movieID, scheduleID]);

    const branch =
        branches.find(
            (item) =>
                Number(
                    item.branchID
                ) ===
                Number(
                    schedule?.branchID
                )
        );

    const screen =
        screens.find(
            (item) =>
                Number(
                    item.screenID
                ) ===
                    Number(
                        schedule?.screenID
                    ) &&
                Number(
                    item.branchID
                ) ===
                    Number(
                        schedule?.branchID
                    )
        );

    const screenName =
        schedule?.screenName ||
        screen?.screenName ||
        "Unknown Screen";

    const currentTicketPrice =
        ticketPrices.find(
            (price) =>
                Number(
                    price.movieID
                ) ===
                    Number(movieID) &&
                Number(
                    price.branchID
                ) ===
                    Number(
                        schedule?.branchID
                    ) &&
                Number(
                    price.screenID
                ) ===
                    Number(
                        schedule?.screenID
                    ) &&
                price.status !==
                    "Inactive"
        )?.price || 0;

    const subtotal =
        selectedSeats.length *
        Number(
            currentTicketPrice
        );

    const availablePromotions =
        promotions.filter(
            (promotion) =>
                promotion.status ===
                "Active"
        );

    const getDayName =
        (dateString) => {

            if (!dateString) {
                return "";
            }

            const date =
                new Date(
                    `${dateString}T00:00:00`
                );

            return date.toLocaleDateString(
                "en-US",
                {
                    weekday:
                        "long",
                }
            );

        };

    const isPromotionValidForBooking =
        (promotion) => {

            if (
                !promotion ||
                promotion.status !==
                    "Active"
            ) {
                return false;
            }

            const showDate =
                schedule?.showDate;

            if (!showDate) {
                return false;
            }

            if (
                showDate <
                    promotion.startDate ||
                showDate >
                    promotion.endDate
            ) {
                return false;
            }

            const applicableDay =
                promotion.applicableDay ||
                "All Days";

            if (
                applicableDay ===
                "All Days"
            ) {
                return true;
            }

            const showDay =
                getDayName(
                    showDate
                );

            if (
                applicableDay ===
                "Saturday & Sunday"
            ) {
                return (
                    showDay ===
                        "Saturday" ||
                    showDay ===
                        "Sunday"
                );
            }

            return (
                applicableDay ===
                showDay
            );

        };

    const isPromotionValidForMovie =
        (promotion) => {

            if (!promotion) {
                return false;
            }

            const movieScope =
                promotion.movieScope ||
                "all";

            if (
                movieScope ===
                "all"
            ) {
                return true;
            }

            const applicableMovieIDs =
                Array.isArray(
                    promotion.applicableMovieIDs
                )
                    ? promotion.applicableMovieIDs
                    : [];

            return applicableMovieIDs.some(
                (id) =>
                    Number(id) ===
                    Number(movieID)
            );

        };

    const handleApplyPromotion =
        () => {

            const code =
                promotionCode
                    .trim()
                    .toUpperCase();

            if (!code) {

                setPromotionMessage(
                    "Please select or enter a promotion code."
                );

                setAppliedPromotion(
                    null
                );

                setDiscountAmount(0);

                return;

            }

            const promotion =
                promotions.find(
                    (item) =>
                        item.promotionCode ===
                        code
                );

            if (!promotion) {

                setPromotionMessage(
                    "Invalid promotion code."
                );

                setAppliedPromotion(
                    null
                );

                setDiscountAmount(0);

                return;

            }

            if (
                promotion.status !==
                "Active"
            ) {

                setPromotionMessage(
                    "This promotion is currently inactive."
                );

                setAppliedPromotion(
                    null
                );

                setDiscountAmount(0);

                return;

            }

            if (
                !isPromotionValidForMovie(
                    promotion
                )
            ) {

                const applicableMovieIDs =
                    Array.isArray(
                        promotion.applicableMovieIDs
                    )
                        ? promotion.applicableMovieIDs
                        : [];

                const applicableMovieNames =
                    applicableMovieIDs
                        .map((id) => {

                            const applicableMovie =
                                movieID ===
                                    Number(id)
                                    ? movie
                                    : null;

                            return applicableMovie
                                ? applicableMovie.title
                                : null;

                        })
                        .filter(Boolean);

                const movieText =
                    applicableMovieNames.length >
                    0
                        ? applicableMovieNames.join(
                            ", "
                        )
                        : "selected movies";

                setPromotionMessage(
                    `This promotion is only valid for ${movieText}.`
                );

                setAppliedPromotion(
                    null
                );

                setDiscountAmount(0);

                return;

            }

            if (
                !isPromotionValidForBooking(
                    promotion
                )
            ) {

                const showDate =
                    schedule?.showDate;

                if (
                    showDate <
                        promotion.startDate ||
                    showDate >
                        promotion.endDate
                ) {

                    setPromotionMessage(
                        `This promotion is valid from ${promotion.startDate} to ${promotion.endDate}.`
                    );

                } else {

                    setPromotionMessage(
                        `This promotion is only valid for ${promotion.applicableDay || "All Days"} bookings.`
                    );

                }

                setAppliedPromotion(
                    null
                );

                setDiscountAmount(0);

                return;

            }

            const discount =
                Math.round(
                    subtotal *
                        Number(
                            promotion.discountPercentage
                        ) /
                        100
                );

            setAppliedPromotion(
                promotion
            );

            setDiscountAmount(
                discount
            );

            setPromotionMessage(
                `${promotion.promotionCode} applied successfully.`
            );

            setShowPromotionSuggestions(
                false
            );

        };

    const finalAmount =
        Math.max(
            0,
            subtotal -
                discountAmount
        );

    const handleSelectPromotion =
        (promotion) => {

            setPromotionCode(
                promotion.promotionCode
            );

            setShowPromotionSuggestions(
                false
            );

            setPromotionMessage("");

        };

    const getOccupiedSeats =
        async () => {

            const response =
                await fetch(
                    `${API_URL}/bookings/schedule/${scheduleID}/occupied-seats`
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to check occupied seats."
                );
            }

            return Array.isArray(
                data.occupiedSeats
            )
                ? data.occupiedSeats
                : [];

        };

    const handlePayment =
        async (event) => {

            event.preventDefault();

            if (
                selectedSeats.length ===
                0
            ) {

                alert(
                    "No seats were selected. Please return to seat selection."
                );

                navigate(
                    `/booking/${movieID}?schedule=${scheduleID}`
                );

                return;

            }

            if (
                currentTicketPrice <= 0
            ) {

                alert(
                    "Ticket price could not be found for this show."
                );

                return;

            }

            if (
                paymentMethod ===
                "mobile banking"
            ) {

                const cleanMobileNumber =
                    mobileBankingNumber.trim();

                const mobileNumberRegex =
                    /^01[3-9]\d{8}$/;

                if (
                    !mobileNumberRegex.test(
                        cleanMobileNumber
                    )
                ) {

                    alert(
                        "Please enter a valid 11-digit Bangladesh mobile banking number."
                    );

                    return;

                }

            }

            try {

                const occupiedSeats =
                    await getOccupiedSeats();

                const seatAlreadyBooked =
                    selectedSeats.some(
                        (seat) =>
                            occupiedSeats.includes(
                                seat
                            )
                    );

                if (
                    seatAlreadyBooked
                ) {

                    alert(
                        "One or more selected seats have already been booked. Please return to seat selection."
                    );

                    navigate(
                        `/booking/${movieID}?schedule=${scheduleID}`
                    );

                    return;

                }

                const newTransactionID =
                    "TXN" +
                    Date.now();

                setTransactionID(
                    newTransactionID
                );

                if (
                    simulateFailure
                ) {

                    setPaymentFailed(
                        true
                    );

                    return;

                }

                setPaymentFailed(
                    false
                );

                setPaymentSuccess(
                    true
                );

            } catch (error) {

                console.error(
                    "Payment validation failed:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to verify seat availability."
                );

            }

        };

    const handleRetryPayment =
        () => {

            setPaymentFailed(
                false
            );

            setPaymentSuccess(
                false
            );

            setSimulateFailure(
                false
            );

            setTransactionID("");

        };

    const handleConfirmBooking =
        async () => {

            if (
                isConfirmingBooking
            ) {
                return;
            }

            const customer =
                JSON.parse(
                    sessionStorage.getItem(
                        "user"
                    )
                ) || {};

            if (!customer.userID) {

                alert(
                    "Customer information was not found. Please log in again."
                );

                navigate(
                    "/login"
                );

                return;

            }

            if (
                selectedSeats.length ===
                0
            ) {

                alert(
                    "No seats were selected. Please return to seat selection."
                );

                navigate(
                    `/booking/${movieID}?schedule=${scheduleID}`
                );

                return;

            }

            if (
                currentTicketPrice <= 0
            ) {

                alert(
                    "Ticket price could not be found for this show."
                );

                return;

            }

            try {

                const occupiedSeats =
                    await getOccupiedSeats();

                const seatAlreadyBooked =
                    selectedSeats.some(
                        (seat) =>
                            occupiedSeats.includes(
                                seat
                            )
                    );

                if (
                    seatAlreadyBooked
                ) {

                    alert(
                        "One or more selected seats are already booked. This booking cannot be confirmed."
                    );

                    navigate(
                        `/booking/${movieID}?schedule=${scheduleID}`
                    );

                    return;

                }

                setIsConfirmingBooking(
                    true
                );

                const bookingPayload = {
                    customerID:
                        customer.userID,

                    customerName:
                        customer.name ||
                        "Guest",

                    customerEmail:
                        customer.email ||
                        "Not available",

                    customerPhone:
                        customer.phone ||
                        "Not available",

                    movieID:
                        movieID,

                    movieTitle:
                        movie.title,

                    scheduleID:
                        scheduleID,

                    branchID:
                        Number(
                            schedule.branchID
                        ),

                    branchName:
                        branch?.branchName ||
                        "",

                    location:
                        branch?.location ||
                        "",

                    screenID:
                        Number(
                            schedule.screenID
                        ),

                    screenName:
                        screenName,

                    showDate:
                        schedule.showDate,

                    startTime:
                        schedule.startTime,

                    endTime:
                        schedule.endTime ||
                        "",

                    selectedSeats:
                        selectedSeats,

                    ticketPrice:
                        Number(
                            currentTicketPrice
                        ),

                    subtotal:
                        subtotal,

                    discountAmount:
                        discountAmount,

                    promotionCode:
                        appliedPromotion?.promotionCode ||
                        "",

                    discountPercentage:
                        Number(
                            appliedPromotion?.discountPercentage ||
                            0
                        ),

                    totalAmount:
                        finalAmount,

                    paymentMethod:
                        paymentMethod,

                    transactionID:
                        transactionID,

                    paymentStatus:
                        "Paid",

                    status:
                        "Confirmed",

                    bookingDate:
                        new Date().toISOString(),
                };

                const bookingResponse =
                    await fetch(
                        `${API_URL}/bookings`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    bookingPayload
                                ),
                        }
                    );

                const bookingData =
                    await bookingResponse.json();

                if (
                    !bookingResponse.ok
                ) {

                    throw new Error(
                        bookingData.message ||
                        "Booking creation failed"
                    );

                }

                const mongoBookingID =
                    bookingData.booking._id;

                const paymentPayload = {
                    amount:
                        finalAmount,

                    subtotal:
                        subtotal,

                    discountAmount:
                        discountAmount,

                    promotionCode:
                        appliedPromotion?.promotionCode ||
                        "",

                    paymentMethod:
                        paymentMethod,

                    transactionID:
                        transactionID,

                    paymentStatus:
                        "Paid",
                };

                const paymentResponse =
                    await fetch(
                        `${API_URL}/bookings/${mongoBookingID}/payment`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    paymentPayload
                                ),
                        }
                    );

                const paymentResult =
                    await paymentResponse.json();

                if (
                    !paymentResponse.ok
                ) {

                    throw new Error(
                        paymentResult.message ||
                        "Payment record creation failed"
                    );

                }

                const ticketID =
                    "TKT" +
                    Date.now();

                const ticketPayload = {
                    ticketID:
                        ticketID,

                    movieID:
                        movieID,

                    movieTitle:
                        movie.title,

                    scheduleID:
                        scheduleID,

                    branchID:
                        Number(
                            schedule.branchID
                        ),

                    branchName:
                        branch?.branchName ||
                        "",

                    location:
                        branch?.location ||
                        "",

                    screenID:
                        Number(
                            schedule.screenID
                        ),

                    screenName:
                        screenName,

                    showDate:
                        schedule.showDate,

                    startTime:
                        schedule.startTime,

                    endTime:
                        schedule.endTime ||
                        "",

                    seatIDs:
                        selectedSeats,

                    numberOfSeats:
                        selectedSeats.length,

                    ticketPrice:
                        Number(
                            currentTicketPrice
                        ),

                    subtotal:
                        subtotal,

                    discountAmount:
                        discountAmount,

                    promotionCode:
                        appliedPromotion?.promotionCode ||
                        "",

                    discountPercentage:
                        Number(
                            appliedPromotion?.discountPercentage ||
                            0
                        ),

                    totalAmount:
                        finalAmount,

                    paymentMethod:
                        paymentMethod,

                    transactionID:
                        transactionID,

                    paymentStatus:
                        "Paid",

                    issueDate:
                        new Date().toISOString(),

                    status:
                        "Active",
                };

                const ticketResponse =
                    await fetch(
                        `${API_URL}/bookings/${mongoBookingID}/ticket`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    ticketPayload
                                ),
                        }
                    );

                const ticketResult =
                    await ticketResponse.json();

                if (
                    !ticketResponse.ok
                ) {

                    throw new Error(
                        ticketResult.message ||
                        "Ticket generation failed"
                    );

                }

                navigate(
                    `/ticket?booking=${mongoBookingID}`
                );

            } catch (error) {

                console.error(
                    "Booking confirmation failed:",
                    error
                );

                alert(
                    error.message ||
                    "Something went wrong while confirming your booking."
                );

            } finally {

                setIsConfirmingBooking(
                    false
                );

            }

        };

    if (loading) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading payment information...
                    </p>

                </div>

            </div>

        );

    }

    if (
        loadError ||
        !movie ||
        !schedule
    ) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-bold">
                        Payment Information Not Found
                    </h1>

                    <p className="mt-3 text-base-content/60">
                        {loadError ||
                            "Please select a valid movie and showtime."}
                    </p>

                    <Link
                        to="/movies"
                        className="btn btn-primary mt-6"
                    >
                        Back to Movies
                    </Link>

                </div>

            </div>
        );

    }

    if (paymentFailed) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="card bg-base-100 shadow-xl w-full max-w-lg">

                    <div className="card-body text-center">

                        <FaExclamationTriangle
                            className="text-error text-6xl mx-auto"
                        />

                        <h1 className="text-3xl font-bold mt-4">
                            Payment Failed
                        </h1>

                        <p className="text-base-content/60 mt-2">
                            Your payment could not be processed.
                            Please try again.
                        </p>

                        <div className="divider"></div>

                        <div className="alert alert-error text-left">

                            <div>

                                <h3 className="font-bold">
                                    Payment Error
                                </h3>

                                <p className="text-sm mt-1">
                                    The payment was unsuccessful.
                                    No booking has been confirmed
                                    and no ticket has been generated.
                                </p>

                            </div>

                        </div>

                        <div className="flex flex-col gap-3 mt-6">

                            <button
                                type="button"
                                onClick={
                                    handleRetryPayment
                                }
                                className="btn btn-primary w-full"
                            >
                                <FaRedo />
                                Retry Payment
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/booking/${movieID}?schedule=${scheduleID}`
                                    )
                                }
                                className="btn btn-ghost w-full"
                            >
                                Return to Seat Selection
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );

    }

    if (paymentSuccess) {

        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="card bg-base-100 shadow-xl w-full max-w-lg">

                    <div className="card-body text-center">

                        <FaCheckCircle
                            className="text-success text-6xl mx-auto"
                        />

                        <h1 className="text-3xl font-bold mt-4">
                            Payment Successful
                        </h1>

                        <p className="text-base-content/60 mt-2">
                            Your payment has been processed successfully.
                        </p>

                        <div className="divider"></div>

                        <div className="text-left space-y-4">

                            <div className="flex justify-between">
                                <span>
                                    Movie
                                </span>

                                <span className="font-semibold">
                                    {movie.title}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Cinema
                                </span>

                                <span className="font-semibold text-right">
                                    {branch?.branchName}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Location
                                </span>

                                <span className="font-semibold text-right">
                                    {branch?.location}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Screen
                                </span>

                                <span className="font-semibold text-right">
                                    {screenName}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Showtime
                                </span>

                                <span className="font-semibold text-right">
                                    {schedule.showDate}
                                    {" • "}
                                    {schedule.startTime}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Seats
                                </span>

                                <span className="font-semibold">
                                    {selectedSeats.join(", ")}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Ticket Price
                                </span>

                                <span className="font-semibold">
                                    ৳{currentTicketPrice}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Subtotal
                                </span>

                                <span className="font-semibold">
                                    ৳{subtotal}
                                </span>
                            </div>

                            {appliedPromotion && (
                                <div className="flex justify-between text-success">

                                    <span>
                                        Discount (
                                        {
                                            appliedPromotion.discountPercentage
                                        }%)
                                    </span>

                                    <span className="font-semibold">
                                        -৳{discountAmount}
                                    </span>

                                </div>
                            )}

                            <div className="flex justify-between">

                                <span>
                                    Payment Method
                                </span>

                                <span className="font-semibold capitalize">
                                    {paymentMethod ===
                                    "mobile banking"
                                        ? `${mobileBankingProvider} Mobile Banking`
                                        : paymentMethod}
                                </span>

                            </div>

                            <div className="flex justify-between gap-4">

                                <span>
                                    Transaction ID
                                </span>

                                <span className="font-semibold text-right break-all">
                                    {transactionID}
                                </span>

                            </div>

                            <div className="flex justify-between text-xl font-bold">

                                <span>
                                    Total Paid
                                </span>

                                <span className="text-primary">
                                    ৳{finalAmount}
                                </span>

                            </div>

                        </div>

                        <div className="divider"></div>

                        <div className="alert alert-info text-left">

                            <div>

                                <h3 className="font-bold">
                                    Confirm Your Booking
                                </h3>

                                <p className="text-sm mt-1">
                                    Your payment was successful.
                                    Confirm the booking to generate
                                    your movie ticket.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                handleConfirmBooking
                            }
                            disabled={
                                isConfirmingBooking
                            }
                            className="btn btn-primary w-full mt-4"
                        >
                            {isConfirmingBooking
                                ? "Confirming Booking..."
                                : "Confirm Booking & Generate Ticket"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/booking/${movieID}?schedule=${scheduleID}`
                                )
                            }
                            className="btn btn-ghost w-full mt-2"
                        >
                            Return to Booking
                        </button>

                    </div>

                </div>

            </div>
        );

    }

    return (
        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-5xl mx-auto">

                <Link
                    to={`/booking/${movieID}?schedule=${scheduleID}`}
                    className="btn btn-ghost mb-6"
                >

                    <FaArrowLeft />

                    Back to Seat Selection

                </Link>

                <div className="text-center mb-10">

                    <p className="text-primary font-semibold">
                        SECURE PAYMENT
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        Complete Your Payment
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        Confirm your booking and select a payment method.
                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    <div className="card bg-base-100 shadow-md h-fit">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold">
                                Booking Summary
                            </h2>

                            <div className="divider"></div>

                            <div>

                                <p className="text-sm text-base-content/60">
                                    Movie
                                </p>

                                <p className="font-semibold text-lg">
                                    {movie.title}
                                </p>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm text-base-content/60">
                                    Cinema
                                </p>

                                <p className="font-semibold">
                                    {branch?.branchName}
                                </p>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm text-base-content/60">
                                    Location
                                </p>

                                <p className="font-semibold">
                                    {branch?.location}
                                </p>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm text-base-content/60">
                                    Screen
                                </p>

                                <p className="font-semibold">
                                    {screenName}
                                </p>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm text-base-content/60">
                                    Showtime
                                </p>

                                <p className="font-semibold">
                                    {schedule.showDate}
                                    {" • "}
                                    {schedule.startTime}
                                </p>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm text-base-content/60">
                                    Selected Seats
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {selectedSeats.map(
                                        (seat) => (

                                            <span
                                                key={seat}
                                                className="badge badge-primary"
                                            >
                                                {seat}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between">

                                <span>
                                    Ticket Price
                                </span>

                                <span>
                                    ৳{currentTicketPrice}
                                </span>

                            </div>

                            <div className="flex justify-between mt-3">

                                <span>
                                    Number of Seats
                                </span>

                                <span>
                                    {selectedSeats.length}
                                </span>

                            </div>

                            <div className="flex justify-between mt-3">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ৳{subtotal}
                                </span>

                            </div>

                            {appliedPromotion && (
                                <div className="flex justify-between mt-3 text-success">

                                    <span>
                                        Discount (
                                        {
                                            appliedPromotion.discountPercentage
                                        }%)
                                    </span>

                                    <span>
                                        -৳{discountAmount}
                                    </span>

                                </div>
                            )}

                            <div className="flex justify-between text-xl font-bold mt-5">

                                <span>
                                    Total Amount
                                </span>

                                <span className="text-primary">
                                    ৳{finalAmount}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold">
                                Payment Method
                            </h2>

                            <div className="mt-5 relative">

                                <label className="label">

                                    <span className="label-text">
                                        Promotion Code
                                    </span>

                                </label>

                                <div className="flex gap-2">

                                    <input
                                        type="text"
                                        value={
                                            promotionCode
                                        }
                                        onChange={(
                                            event
                                        ) => {

                                            setPromotionCode(
                                                event.target.value.toUpperCase()
                                            );

                                            setPromotionMessage("");

                                        }}
                                        onFocus={() =>
                                            setShowPromotionSuggestions(
                                                true
                                            )
                                        }
                                        placeholder="Enter promotion code"
                                        className="input input-bordered w-full"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleApplyPromotion
                                        }
                                        className="btn btn-outline btn-primary"
                                    >
                                        Apply
                                    </button>

                                </div>

                                {showPromotionSuggestions &&
                                    availablePromotions.length >
                                        0 && (

                                        <div className="absolute left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50">

                                            <div className="p-3 border-b border-base-300">

                                                <p className="font-semibold">
                                                    Available Promotions
                                                </p>

                                                <p className="text-xs text-base-content/60 mt-1">
                                                    Select a promotion code
                                                </p>

                                            </div>

                                            {availablePromotions.map(
                                                (
                                                    promotion
                                                ) => (

                                                    <button
                                                        key={
                                                            promotion.promotionID
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectPromotion(
                                                                promotion
                                                            )
                                                        }
                                                        className="w-full text-left px-4 py-3 hover:bg-base-200 transition border-b border-base-300 last:border-b-0"
                                                    >

                                                        <div className="flex justify-between items-center">

                                                            <span className="badge badge-primary font-semibold">
                                                                {
                                                                    promotion.promotionCode
                                                                }
                                                            </span>

                                                            <span className="font-bold text-primary">
                                                                {
                                                                    promotion.discountPercentage
                                                                }%
                                                            </span>

                                                        </div>

                                                        <p className="text-sm mt-2">
                                                            {
                                                                promotion.description
                                                            }
                                                        </p>

                                                        <p className="text-xs text-base-content/60 mt-1">

                                                            {
                                                                promotion.movieScope ===
                                                                "selected"
                                                                    ? "Selected Movies"
                                                                    : "All Movies"
                                                            }

                                                            {" • "}

                                                            {
                                                                promotion.applicableDay ||
                                                                "All Days"
                                                            }

                                                            {" • "}

                                                            Valid until{" "}

                                                            {
                                                                promotion.endDate
                                                            }

                                                        </p>

                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                {promotionMessage && (

                                    <p
                                        className={`text-sm mt-2 font-semibold ${
                                            appliedPromotion
                                                ? "text-success"
                                                : "text-error"
                                        }`}
                                    >
                                        {
                                            promotionMessage
                                        }
                                    </p>

                                )}

                            </div>

                            <div className="divider"></div>

                            <form
                                onSubmit={
                                    handlePayment
                                }
                            >

                                <div className="grid grid-cols-3 gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPaymentMethod(
                                                "card"
                                            )
                                        }
                                        className={`btn h-20 flex-col ${
                                            paymentMethod ===
                                            "card"
                                                ? "btn-primary"
                                                : "btn-outline"
                                        }`}
                                    >

                                        <FaCreditCard />

                                        Card

                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod(
                                                "mobile banking"
                                            );
                                        }}
                                        className={`btn h-20 flex-col ${
                                            paymentMethod ===
                                            "mobile banking"
                                                ? "btn-primary"
                                                : "btn-outline"
                                        }`}
                                    >

                                        <FaMobileAlt />

                                        Mobile Banking

                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPaymentMethod(
                                                "cash"
                                            )
                                        }
                                        className={`btn h-20 flex-col ${
                                            paymentMethod ===
                                            "cash"
                                                ? "btn-primary"
                                                : "btn-outline"
                                        }`}
                                    >

                                        <FaMoneyBillWave />

                                        Cash

                                    </button>

                                </div>

                                {paymentMethod ===
                                    "card" && (

                                    <div className="mt-6">

                                        <label className="label">
                                            Card Number
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                        <div className="grid grid-cols-2 gap-4 mt-4">

                                            <div>

                                                <label className="label">
                                                    Expiry Date
                                                </label>

                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="input input-bordered w-full"
                                                    required
                                                />

                                            </div>

                                            <div>

                                                <label className="label">
                                                    CVV
                                                </label>

                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    className="input input-bordered w-full"
                                                    required
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )}

                                {paymentMethod ===
                                    "mobile banking" && (

                                    <div className="mt-6">

                                        <label className="label">

                                            <span className="label-text font-semibold">
                                                Select Mobile Banking
                                            </span>

                                        </label>

                                        <div className="grid grid-cols-3 gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMobileBankingProvider(
                                                        "bkash"
                                                    )
                                                }
                                                className={`btn h-20 ${
                                                    mobileBankingProvider ===
                                                    "bkash"
                                                        ? "border-2 border-primary bg-primary/10"
                                                        : "btn-outline"
                                                }`}
                                            >

                                                <img
                                                    src={
                                                        bkashLogo
                                                    }
                                                    alt="bKash"
                                                    className="h-18 w-auto object-contain"
                                                />

                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMobileBankingProvider(
                                                        "nagad"
                                                    )
                                                }
                                                className={`btn h-20 ${
                                                    mobileBankingProvider ===
                                                    "nagad"
                                                        ? "border-2 border-primary bg-primary/10"
                                                        : "btn-outline"
                                                }`}
                                            >

                                                <img
                                                    src={
                                                        nagadLogo
                                                    }
                                                    alt="Nagad"
                                                   className="h-18 w-auto object-contain"
                                                />

                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMobileBankingProvider(
                                                        "upay"
                                                    )
                                                }
                                                className={`btn h-20 ${
                                                    mobileBankingProvider ===
                                                    "upay"
                                                        ? "border-2 border-primary bg-primary/10"
                                                        : "btn-outline"
                                                }`}
                                            >

                                                <img
                                                    src={
                                                        upayLogo
                                                    }
                                                    alt="Upay"
                                                    className="h-18 w-auto object-contain"
                                                />

                                            </button>

                                        </div>

                                        <div className="mt-5">

                                            <label className="label">

                                                <span className="label-text">
                                                    {mobileBankingProvider ===
                                                    "bkash"
                                                        ? "bKash Number"
                                                        : mobileBankingProvider ===
                                                            "nagad"
                                                            ? "Nagad Number"
                                                            : "Upay Number"}
                                                </span>

                                            </label>

                                            <input
                                                type="tel"
                                                value={
                                                    mobileBankingNumber
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setMobileBankingNumber(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="01XXXXXXXXX"
                                                maxLength="11"
                                                className="input input-bordered w-full"
                                                required
                                            />

                                            <p className="text-xs text-base-content/60 mt-2">
                                                Enter your 11-digit Bangladesh mobile banking number.
                                            </p>

                                        </div>

                                    </div>

                                )}

                                {paymentMethod ===
                                    "cash" && (

                                    <div className="alert mt-6">

                                        <FaMoneyBillWave />

                                        <span>
                                            You can complete the payment
                                            at the cinema counter.
                                        </span>

                                    </div>

                                )}

                                <div className="form-control mt-6">

                                    <label className="label cursor-pointer justify-start gap-3">

                                        <input
                                            type="checkbox"
                                            checked={
                                                simulateFailure
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setSimulateFailure(
                                                    event.target.checked
                                                )
                                            }
                                            className="checkbox checkbox-error"
                                        />

                                        <span>

                                            <span className="label-text font-semibold">
                                                Simulate Payment Failure
                                            </span>

                                            <span className="block text-xs text-base-content/60 mt-1">
                                                Use this option to test the payment failure and retry flow.
                                            </span>

                                        </span>

                                    </label>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full mt-6"
                                >
                                    Pay ৳{finalAmount}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default Payment;