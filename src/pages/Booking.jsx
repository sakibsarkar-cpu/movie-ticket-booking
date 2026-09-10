import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useSearchParams,
    useParams,
    useNavigate,
} from "react-router-dom";
import {
    FaArrowLeft,
    FaLightbulb,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function Booking() {

    const { movieID } =
        useParams();

    const [searchParams] =
        useSearchParams();

    const navigate =
        useNavigate();

    const scheduleID =
        Number(
            searchParams.get("schedule")
        );

    const [movies, setMovies] =
        useState([]);

    const [branches, setBranches] =
        useState([]);

    const [screens, setScreens] =
        useState([]);

    const [schedules, setSchedules] =
        useState([]);

    const [ticketPrices, setTicketPrices] =
        useState([]);

    const [allConfiguredSeats, setAllConfiguredSeats] =
        useState([]);

    const [occupiedSeats, setOccupiedSeats] =
        useState([]);

    const [selectedSeats, setSelectedSeats] =
        useState([]);

    const [recommendationMessage, setRecommendationMessage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {

        const fetchBookingData =
            async () => {

                try {

                    setLoading(true);
                    setErrorMessage("");

                    const [
                        moviesResponse,
                        branchesResponse,
                        screensResponse,
                        schedulesResponse,
                        seatsResponse,
                        ticketPricesResponse,
                    ] = await Promise.all([
                        fetch(`${API_URL}/movies`),
                        fetch(`${API_URL}/branches`),
                        fetch(`${API_URL}/screens`),
                        fetch(`${API_URL}/schedules`),
                        fetch(`${API_URL}/seats`),
                        fetch(`${API_URL}/ticket-prices`),
                    ]);

                    const [
                        moviesData,
                        branchesData,
                        screensData,
                        schedulesData,
                        seatsData,
                        ticketPricesData,
                    ] = await Promise.all([
                        moviesResponse.json(),
                        branchesResponse.json(),
                        screensResponse.json(),
                        schedulesResponse.json(),
                        seatsResponse.json(),
                        ticketPricesResponse.json(),
                    ]);

                    if (!moviesResponse.ok) {
                        throw new Error(
                            moviesData.message ||
                            "Failed to fetch movies"
                        );
                    }

                    if (!branchesResponse.ok) {
                        throw new Error(
                            branchesData.message ||
                            "Failed to fetch branches"
                        );
                    }

                    if (!screensResponse.ok) {
                        throw new Error(
                            screensData.message ||
                            "Failed to fetch screens"
                        );
                    }

                    if (!schedulesResponse.ok) {
                        throw new Error(
                            schedulesData.message ||
                            "Failed to fetch schedules"
                        );
                    }

                    if (!seatsResponse.ok) {
                        throw new Error(
                            seatsData.message ||
                            "Failed to fetch seats"
                        );
                    }

                    if (!ticketPricesResponse.ok) {
                        throw new Error(
                            ticketPricesData.message ||
                            "Failed to fetch ticket prices"
                        );
                    }

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

                    setTicketPrices(
                        Array.isArray(ticketPricesData)
                            ? ticketPricesData
                            : []
                    );

                    setAllConfiguredSeats(
                        Array.isArray(seatsData)
                            ? seatsData
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load booking data:",
                        error
                    );

                    setErrorMessage(
                        "Unable to load booking information. Please try again."
                    );

                } finally {

                    setLoading(false);

                }

            };

        fetchBookingData();

    }, []);

    useEffect(() => {

        const fetchOccupiedSeats =
            async () => {

                if (!scheduleID) {

                    setOccupiedSeats([]);

                    return;

                }

                try {

                    const response =
                        await fetch(
                            `${API_URL}/bookings/schedule/${scheduleID}/occupied-seats`
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Failed to fetch occupied seats"
                        );

                    }

                    setOccupiedSeats(
                        Array.isArray(
                            data.occupiedSeats
                        )
                            ? data.occupiedSeats
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load occupied seats:",
                        error
                    );

                    setOccupiedSeats([]);

                }

            };

        fetchOccupiedSeats();

    }, [
        scheduleID,
    ]);

    const movie =
        movies.find(
            (item) =>
                Number(
                    item.movieID
                ) ===
                Number(movieID)
        );

    const schedule =
        schedules.find(
            (item) =>
                Number(
                    item.scheduleID
                ) ===
                    scheduleID &&
                Number(
                    item.movieID
                ) ===
                    Number(movieID)
        );

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
                )
        );

    const currentTicketPrice =
        ticketPrices.find(
            (item) =>
                Number(
                    item.movieID
                ) ===
                    Number(
                        schedule?.movieID
                    ) &&
                Number(
                    item.branchID
                ) ===
                    Number(
                        schedule?.branchID
                    ) &&
                Number(
                    item.screenID
                ) ===
                    Number(
                        schedule?.screenID
                    ) &&
                item.status ===
                    "Active"
        );

    const ticketPrice =
        Number(
            currentTicketPrice?.price ??
            schedule?.ticketPrice ??
            0
        );

    const screenName =
        schedule?.screenName ||
        screen?.screenName ||
        "Unknown Screen";

    const screenSeats =
        useMemo(() => {

            return allConfiguredSeats.filter(
                (seat) =>
                    Number(
                        seat.screenID
                    ) ===
                    Number(
                        schedule?.screenID
                    )
            );

        }, [
            allConfiguredSeats,
            schedule?.screenID,
        ]);

    const seatRows =
        useMemo(() => {

            const groupedRows = {};

            screenSeats.forEach(
                (seat) => {

                    const match =
                        seat.seatNumber.match(
                            /^[A-Z]+/
                        );

                    const row =
                        match
                            ? match[0]
                            : "Other";

                    if (
                        !groupedRows[row]
                    ) {

                        groupedRows[row] = [];

                    }

                    groupedRows[row].push(
                        seat
                    );

                }
            );

            Object.keys(
                groupedRows
            ).forEach(
                (row) => {

                    groupedRows[row].sort(
                        (a, b) => {

                            const numberA =
                                Number(
                                    a.seatNumber.replace(
                                        /^[A-Z]+/,
                                        ""
                                    )
                                );

                            const numberB =
                                Number(
                                    b.seatNumber.replace(
                                        /^[A-Z]+/,
                                        ""
                                    )
                                );

                            return (
                                numberA -
                                numberB
                            );

                        }
                    );

                }
            );

            return groupedRows;

        }, [
            screenSeats,
        ]);

    const availableSeats =
        useMemo(() => {

            return screenSeats.filter(
                (seat) =>
                    seat.status ===
                        "Available" &&
                    !occupiedSeats.includes(
                        seat.seatNumber
                    )
            );

        }, [
            screenSeats,
            occupiedSeats,
        ]);

    const toggleSeat =
        (seatNumber) => {

            if (
                isPastSchedule(
                    schedule?.showDate,
                    schedule?.startTime
                )
            ) {

                return;

            }

            const seat =
                screenSeats.find(
                    (item) =>
                        item.seatNumber ===
                        seatNumber
                );

            if (!seat) {

                return;

            }

            if (
                seat.status !==
                "Available"
            ) {

                return;

            }

            if (
                occupiedSeats.includes(
                    seatNumber
                )
            ) {

                return;

            }

            if (
                selectedSeats.includes(
                    seatNumber
                )
            ) {

                setSelectedSeats(
                    selectedSeats.filter(
                        (seat) =>
                            seat !==
                            seatNumber
                    )
                );

            } else {

                setSelectedSeats([
                    ...selectedSeats,
                    seatNumber,
                ]);

            }

            setRecommendationMessage("");

        };

    const recommendationQuantity =
        selectedSeats.length > 0
            ? selectedSeats.length
            : 2;

    const recommendedSeats =
        useMemo(() => {

            const centerSeats =
                availableSeats.filter(
                    (seat) => {

                        const row =
                            seat.seatNumber.match(
                                /^[A-Z]+/
                            )?.[0];

                        const number =
                            Number(
                                seat.seatNumber.replace(
                                    /^[A-Z]+/,
                                    ""
                                )
                            );

                        return (
                            ["C", "D"].includes(
                                row
                            ) &&
                            [3, 4, 5, 6].includes(
                                number
                            )
                        );

                    }
                );

            const remainingSeats =
                availableSeats.filter(
                    (seat) =>
                        !centerSeats.some(
                            (centerSeat) =>
                                centerSeat.seatNumber ===
                                seat.seatNumber
                        )
                );

            return [
                ...centerSeats,
                ...remainingSeats,
            ]
                .slice(
                    0,
                    recommendationQuantity
                )
                .map(
                    (seat) =>
                        seat.seatNumber
                );

        }, [
            availableSeats,
            recommendationQuantity,
        ]);

    const handleRecommendation =
        () => {

            if (
                isPastSchedule(
                    schedule?.showDate,
                    schedule?.startTime
                )
            ) {

                setRecommendationMessage(
                    "This showtime has already passed."
                );

                return;

            }

            if (
                recommendedSeats.length ===
                0
            ) {

                setRecommendationMessage(
                    "No available seats can be recommended."
                );

                return;

            }

            setSelectedSeats(
                recommendedSeats
            );

            setRecommendationMessage(
                `Recommended seats: ${recommendedSeats.join(", ")}`
            );

        };

    const totalAmount =
        selectedSeats.length *
        ticketPrice;

    const handleContinue =
        async () => {

            if (
                isPastSchedule(
                    schedule?.showDate,
                    schedule?.startTime
                )
            ) {

                alert(
                    "This showtime has already passed. New bookings are not allowed."
                );

                setSelectedSeats([]);

                return;

            }

            if (
                selectedSeats.length ===
                0
            ) {

                alert(
                    "Please select at least one seat."
                );

                return;

            }

            try {

                const [
                    occupiedResponse,
                    seatsResponse,
                    ticketPricesResponse,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/bookings/schedule/${scheduleID}/occupied-seats`
                    ),
                    fetch(
                        `${API_URL}/seats`
                    ),
                    fetch(
                        `${API_URL}/ticket-prices`
                    ),
                ]);

                const [
                    occupiedData,
                    seatsData,
                    ticketPricesData,
                ] = await Promise.all([
                    occupiedResponse.json(),
                    seatsResponse.json(),
                    ticketPricesResponse.json(),
                ]);

                if (!occupiedResponse.ok) {

                    throw new Error(
                        occupiedData.message ||
                        "Failed to check seat availability"
                    );

                }

                if (!seatsResponse.ok) {

                    throw new Error(
                        seatsData.message ||
                        "Failed to check seat configuration"
                    );

                }

                if (!ticketPricesResponse.ok) {

                    throw new Error(
                        ticketPricesData.message ||
                        "Failed to check ticket price"
                    );

                }

                if (
                    isPastSchedule(
                        schedule?.showDate,
                        schedule?.startTime
                    )
                ) {

                    alert(
                        "This showtime has already passed. New bookings are not allowed."
                    );

                    setSelectedSeats([]);

                    return;

                }

                const latestBookedSeats =
                    Array.isArray(
                        occupiedData.occupiedSeats
                    )
                        ? occupiedData.occupiedSeats
                        : [];

                const latestSavedSeats =
                    Array.isArray(
                        seatsData
                    )
                        ? seatsData
                        : [];

                const latestTicketPrices =
                    Array.isArray(
                        ticketPricesData
                    )
                        ? ticketPricesData
                        : [];

                setOccupiedSeats(
                    latestBookedSeats
                );

                setTicketPrices(
                    latestTicketPrices
                );

                const latestScreenSeats =
                    latestSavedSeats.filter(
                        (seat) =>
                            Number(
                                seat.screenID
                            ) ===
                            Number(
                                schedule?.screenID
                            )
                    );

                const seatNotAvailable =
                    selectedSeats.some(
                        (seatNumber) => {

                            const seat =
                                latestScreenSeats.find(
                                    (item) =>
                                        item.seatNumber ===
                                        seatNumber
                                );

                            return (
                                !seat ||
                                seat.status !==
                                    "Available" ||
                                latestBookedSeats.includes(
                                    seatNumber
                                )
                            );

                        }
                    );

                if (
                    seatNotAvailable
                ) {

                    alert(
                        "One or more selected seats are no longer available. Please select different seats."
                    );

                    setSelectedSeats([]);

                    return;

                }

                navigate(
                    `/payment?movie=${movieID}&schedule=${scheduleID}&seats=${encodeURIComponent(selectedSeats.join(","))}`
                );

            } catch (error) {

                console.error(
                    "Seat availability check failed:",
                    error
                );

                alert(
                    "Unable to verify seat availability. Please try again."
                );

            }

        };

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading booking information...
                    </p>

                </div>

            </div>

        );

    }

    if (errorMessage) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-bold">
                        Unable to Load Booking
                    </h1>

                    <p className="mt-3 text-base-content/60">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="btn btn-primary mt-6"
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }

    if (
        !movie ||
        !schedule
    ) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-bold">
                        Booking Information Not Found
                    </h1>

                    <p className="mt-3 text-base-content/60">
                        Please select a valid movie and showtime.
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

    if (
        isPastSchedule(
            schedule.showDate,
            schedule.startTime
        )
    ) {

        return (

            <div className="min-h-screen bg-base-200 py-10">

                <div className="w-[90%] max-w-6xl mx-auto">

                    <Link
                        to={`/movies/${movie.movieID}`}
                        className="btn btn-ghost mb-6"
                    >

                        <FaArrowLeft />

                        Back to Showtimes

                    </Link>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body text-center py-16">

                            <h1 className="text-3xl font-bold">
                                Showtime Has Passed
                            </h1>

                            <p className="text-base-content/60 mt-3">
                                This showtime has already started and is no longer available for booking.
                            </p>

                            <p className="font-semibold mt-4">
                                {schedule.showDate}
                                {" • "}
                                {formatTime(
                                    schedule.startTime
                                )}
                            </p>

                            <Link
                                to={`/movies/${movie.movieID}`}
                                className="btn btn-primary mt-6"
                            >
                                Back to Showtimes
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    if (
        screenSeats.length ===
        0
    ) {

        return (

            <div className="min-h-screen bg-base-200 py-10">

                <div className="w-[90%] max-w-6xl mx-auto">

                    <Link
                        to={`/movies/${movie.movieID}`}
                        className="btn btn-ghost mb-6"
                    >

                        <FaArrowLeft />

                        Back to Showtimes

                    </Link>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body text-center py-16">

                            <h1 className="text-3xl font-bold">
                                No Seats Available
                            </h1>

                            <p className="text-base-content/60 mt-3">
                                No seats have been configured for this cinema screen yet.
                            </p>

                            <Link
                                to={`/movies/${movie.movieID}`}
                                className="btn btn-primary mt-6"
                            >
                                Back to Showtimes
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-6xl mx-auto">

                <Link
                    to={`/movies/${movie.movieID}`}
                    className="btn btn-ghost mb-6"
                >

                    <FaArrowLeft />

                    Back to Showtimes

                </Link>

                <div className="text-center mb-10">

                    <p className="text-primary font-semibold">
                        SELECT YOUR SEATS
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        {movie.title}
                    </h1>

                    <p className="mt-3 text-base-content/60">

                        {branch?.branchName}

                        {" • "}

                        {screenName}

                    </p>

                    <p className="text-base-content/60">

                        {schedule.showDate}

                        {" • "}

                        {formatTime(
                            schedule.startTime
                        )}

                    </p>

                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold text-center">
                                Choose Your Seats
                            </h2>

                            <div className="mt-8">

                                <div className="w-[80%] mx-auto">

                                    <div className="h-3 bg-primary rounded-full"></div>

                                    <p className="text-center text-sm mt-2 text-base-content/60">
                                        SCREEN
                                    </p>

                                </div>

                            </div>

                            <div className="mt-10 flex flex-col items-center gap-4">

                                {Object.entries(
                                    seatRows
                                ).map(
                                    ([row, rowSeats]) => (

                                        <div
                                            key={row}
                                            className="flex items-center gap-3"
                                        >

                                            <span className="w-5 text-sm font-semibold">
                                                {row}
                                            </span>

                                            <div className="flex flex-wrap gap-2">

                                                {rowSeats.map(
                                                    (seat) => {

                                                        const seatNumber =
                                                            seat.seatNumber;

                                                        const isOccupied =
                                                            occupiedSeats.includes(
                                                                seatNumber
                                                            );

                                                        const isUnavailable =
                                                            seat.status !==
                                                            "Available";

                                                        const isSelected =
                                                            selectedSeats.includes(
                                                                seatNumber
                                                            );

                                                        return (

                                                            <button
                                                                key={
                                                                    seat.seatID
                                                                }
                                                                type="button"
                                                                disabled={
                                                                    isOccupied ||
                                                                    isUnavailable
                                                                }
                                                                onClick={() =>
                                                                    toggleSeat(
                                                                        seatNumber
                                                                    )
                                                                }
                                                                className={`
                                                                    w-10 h-10
                                                                    rounded-md
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-xs
                                                                    font-semibold
                                                                    border
                                                                    transition
                                                                    ${
                                                                        isOccupied ||
                                                                        isUnavailable
                                                                            ? "bg-neutral text-neutral-content cursor-not-allowed"
                                                                            : isSelected
                                                                                ? "bg-primary text-primary-content border-primary"
                                                                                : "bg-base-200 hover:bg-primary/20 border-base-300"
                                                                    }
                                                                `}
                                                            >

                                                                {
                                                                    seatNumber
                                                                }

                                                            </button>

                                                        );

                                                    }
                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                            <div className="flex justify-center gap-6 mt-10 flex-wrap">

                                <div className="flex items-center gap-2">

                                    <span className="w-4 h-4 rounded bg-base-200 border"></span>

                                    <span className="text-sm">
                                        Available
                                    </span>

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="w-4 h-4 rounded bg-primary"></span>

                                    <span className="text-sm">
                                        Selected
                                    </span>

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="w-4 h-4 rounded bg-neutral"></span>

                                    <span className="text-sm">
                                        Occupied
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

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

                                <p className="font-semibold">
                                    {movie.title}
                                </p>

                            </div>

                            <div className="mt-4">

                                <p className="text-sm text-base-content/60">
                                    Cinema
                                </p>

                                <p className="font-semibold">
                                    {branch?.branchName}
                                </p>

                                <p className="text-sm text-base-content/60">
                                    {branch?.location}
                                </p>

                            </div>

                            <div className="mt-4">

                                <p className="text-sm text-base-content/60">
                                    Screen
                                </p>

                                <p className="font-semibold">
                                    {screenName}
                                </p>

                            </div>

                            <div className="mt-4">

                                <p className="text-sm text-base-content/60">
                                    Showtime
                                </p>

                                <p className="font-semibold">

                                    {schedule.showDate}

                                    {" • "}

                                    {formatTime(
                                        schedule.startTime
                                    )}

                                </p>

                            </div>

                            <div className="mt-4">

                                <p className="text-sm text-base-content/60">
                                    Selected Seats
                                </p>

                                {selectedSeats.length > 0 ? (

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

                                ) : (

                                    <p className="text-sm mt-1">
                                        No seats selected
                                    </p>

                                )}

                            </div>

                            <div className="alert alert-info mt-6">

                                <FaLightbulb />

                                <div>

                                    <h3 className="font-bold">
                                        Smart Seat Recommendation
                                    </h3>

                                    <p className="text-sm">

                                        {selectedSeats.length > 0

                                            ? `You selected ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}. We will recommend ${selectedSeats.length} suitable seat${selectedSeats.length > 1 ? "s" : ""}.`

                                            : "Select seats first, or let us recommend 2 suitable center seats."
                                        }

                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            handleRecommendation
                                        }
                                        className="btn btn-sm btn-info mt-2"
                                    >
                                        Recommend Seats
                                    </button>

                                    {recommendationMessage && (

                                        <p className="text-sm font-semibold mt-2">
                                            {
                                                recommendationMessage
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between">

                                <span>
                                    Ticket Price
                                </span>

                                <span>
                                    ৳{ticketPrice}
                                </span>

                            </div>

                            <div className="flex justify-between mt-2">

                                <span>
                                    Seats
                                </span>

                                <span>
                                    {selectedSeats.length}
                                </span>

                            </div>

                            <div className="flex justify-between text-xl font-bold mt-4">

                                <span>
                                    Total
                                </span>

                                <span className="text-primary">
                                    ৳{totalAmount}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleContinue
                                }
                                className="btn btn-primary w-full mt-6"
                            >
                                Proceed to Payment
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

function isPastSchedule(
    showDate,
    startTime
) {

    if (!showDate) {

        return false;

    }

    const today =
        new Date();

    const [
        year,
        month,
        day
    ] =
        showDate
            .split("-")
            .map(Number);

    const showDateOnly =
        new Date(
            year,
            month - 1,
            day
        );

    const todayDateOnly =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

    if (
        showDateOnly <
        todayDateOnly
    ) {

        return true;

    }

    if (
        showDateOnly >
        todayDateOnly
    ) {

        return false;

    }

    if (!startTime) {

        return false;

    }

    let hours;
    let minutes;

    if (
        startTime.includes("AM") ||
        startTime.includes("PM")
    ) {

        const parts =
            startTime
                .trim()
                .split(" ");

        const timeParts =
            parts[0]
                .split(":");

        hours =
            Number(
                timeParts[0]
            );

        minutes =
            Number(
                timeParts[1]
            );

        const period =
            parts[1]
                ?.toUpperCase();

        if (
            period === "PM" &&
            hours !== 12
        ) {

            hours += 12;

        }

        if (
            period === "AM" &&
            hours === 12
        ) {

            hours = 0;

        }

    } else {

        const timeParts =
            startTime
                .split(":");

        hours =
            Number(
                timeParts[0]
            );

        minutes =
            Number(
                timeParts[1]
            );

    }

    const showDateTime =
        new Date(
            year,
            month - 1,
            day,
            hours,
            minutes
        );

    return (
        showDateTime <=
        today
    );

}

function formatTime(time) {

    if (!time) {

        return "";

    }

    if (
        time.includes("AM") ||
        time.includes("PM")
    ) {

        return time;

    }

    const [hours, minutes] =
        time.split(":");

    let hour =
        Number(hours);

    const period =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minutes} ${period}`;

}

export default Booking;