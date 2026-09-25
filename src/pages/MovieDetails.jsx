import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { getPoster } from "../utils/posterImages";

function MovieDetails() {

    const { movieID } = useParams();

    const [movie, setMovie] =
        useState(null);

    const [branches, setBranches] =
        useState([]);

    const [screens, setScreens] =
        useState([]);

    const [schedules, setSchedules] =
        useState([]);

    const [ticketPrices, setTicketPrices] =
        useState([]);

    const [selectedBranch, setSelectedBranch] =
        useState("All");

    const [selectedDate, setSelectedDate] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setErrorMessage("");

                const [
                    movieResponse,
                    branchResponse,
                    screenResponse,
                    scheduleResponse,
                    ticketPriceResponse,
                ] = await Promise.all([
                    fetch(
                        `http://localhost:5000/api/movies/${movieID}`
                    ),
                    fetch(
                        "http://localhost:5000/api/branches"
                    ),
                    fetch(
                        "http://localhost:5000/api/screens"
                    ),
                    fetch(
                        "http://localhost:5000/api/schedules"
                    ),
                    fetch(
                        "http://localhost:5000/api/ticket-prices"
                    ),
                ]);

                const [
                    movieData,
                    branchData,
                    screenData,
                    scheduleData,
                    ticketPriceData,
                ] = await Promise.all([
                    movieResponse.json(),
                    branchResponse.json(),
                    screenResponse.json(),
                    scheduleResponse.json(),
                    ticketPriceResponse.json(),
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
                        "Failed to load show schedules."
                    );
                }

                if (!ticketPriceResponse.ok) {
                    throw new Error(
                        ticketPriceData.message ||
                        "Failed to load ticket prices."
                    );
                }

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

                setTicketPrices(
                    Array.isArray(ticketPriceData)
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

                setSchedules(
                    Array.isArray(scheduleData)
                        ? scheduleData.map(
                            (schedule) => ({
                                ...schedule,
                                scheduleID:
                                    Number(
                                        schedule.scheduleID
                                    ),
                                movieID:
                                    Number(
                                        schedule.movieID
                                    ),
                                branchID:
                                    Number(
                                        schedule.branchID
                                    ),
                                screenID:
                                    Number(
                                        schedule.screenID
                                    ),
                                ticketPrice:
                                    Number(
                                        schedule.ticketPrice
                                    ),
                                status:
                                    schedule.status ===
                                        "Active" ||
                                    schedule.status ===
                                        "active" ||
                                    schedule.status ===
                                        true
                                        ? "Active"
                                        : "Inactive",
                            })
                        )
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load movie details:",
                    error
                );

                setErrorMessage(
                    error.message ||
                    "Failed to load movie details."
                );

                setMovie(null);
                setBranches([]);
                setScreens([]);
                setSchedules([]);
                setTicketPrices([]);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [movieID]);

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
        (screenID, branchID) => {

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

    const getTicketPrice =
        (movieID, branchID, screenID) => {

            const priceRecord =
                ticketPrices.find(
                    (price) =>
                        Number(
                            price.movieID
                        ) ===
                        Number(movieID) &&
                        Number(
                            price.branchID
                        ) ===
                        Number(branchID) &&
                        Number(
                            price.screenID
                        ) ===
                        Number(screenID) &&
                        price.status !==
                        "Inactive"
                );

            return priceRecord
                ? priceRecord.price
                : null;

        };

    const validMovieSchedules =
        schedules.filter(
            (schedule) => {

                const scheduleMovieID =
                    Number(
                        schedule.movieID
                    );

                const scheduleBranchID =
                    Number(
                        schedule.branchID
                    );

                const scheduleScreenID =
                    Number(
                        schedule.screenID
                    );

                const branch =
                    getBranchByID(
                        scheduleBranchID
                    );

                const screen =
                    getScreenByID(
                        scheduleScreenID,
                        scheduleBranchID
                    );

                const currentTicketPrice =
                    getTicketPrice(
                        scheduleMovieID,
                        scheduleBranchID,
                        scheduleScreenID
                    );

                const isMovieMatch =
                    scheduleMovieID ===
                    Number(movie?.movieID);

                const isBranchValid =
                    !!branch &&
                    branch.status !==
                    "Inactive";

                const isScreenValid =
                    !!screen &&
                    screen.status !==
                    "Inactive";

                const isPriceValid =
                    currentTicketPrice !==
                    null;

                const isScheduleActive =
                    schedule.status === true ||
                    schedule.status === "Active" ||
                    schedule.status === "active";

                const isScheduleInFuture =
                    !isPastSchedule(
                        schedule.showDate,
                        schedule.startTime
                    );

                return (
                    isMovieMatch &&
                    isBranchValid &&
                    isScreenValid &&
                    isPriceValid &&
                    isScheduleActive &&
                    isScheduleInFuture
                );

            }
        );

    const availableDates = [
        ...new Set(
            validMovieSchedules.map(
                (schedule) =>
                    schedule.showDate
            )
        ),
    ];

    const filteredSchedules =
        validMovieSchedules.filter(
            (schedule) => {

                const branchMatches =
                    selectedBranch === "All" ||
                    Number(
                        schedule.branchID
                    ) ===
                    Number(
                        selectedBranch
                    );

                const dateMatches =
                    selectedDate === "All" ||
                    schedule.showDate ===
                    selectedDate;

                return (
                    branchMatches &&
                    dateMatches
                );

            }
        );

    if (loading) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading movie details...
                    </p>

                </div>

            </div>

        );

    }

    if (errorMessage || !movie) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-bold">
                        Movie Not Found
                    </h1>

                    <p className="mt-3 text-base-content/60">
                        {errorMessage ||
                            "The movie you are looking for does not exist."}
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

    return (

        <div className="min-h-screen bg-base-200">

            <section className="bg-base-100 py-12">

                <div className="w-[85%] mx-auto">

                    <Link
                        to="/movies"
                        className="btn btn-ghost mb-8"
                    >

                        <FaArrowLeft />

                        Back to Movies

                    </Link>

                    <div className="grid md:grid-cols-3 gap-10 items-start">

                        <div>

                            {getPoster(movie.image) ? (

                                <img
                                    src={getPoster(movie.image)}
                                    alt={movie.title}
                                    className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                                />

                            ) : (

                                <div className="w-full max-w-sm mx-auto h-[500px] rounded-xl shadow-lg bg-base-200 flex items-center justify-center text-base-content/40">
                                    No Image
                                </div>

                            )}

                        </div>

                        <div className="md:col-span-2">

                            <div className="badge badge-primary mb-4">

                                {movie.genre}

                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold">

                                {movie.title}

                            </h1>

                            <p className="mt-5 text-lg text-base-content/70 max-w-3xl">

                                {movie.description}

                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 mt-8">

                                <div className="bg-base-200 rounded-lg p-4">

                                    <p className="text-sm text-base-content/60">
                                        Duration
                                    </p>

                                    <p className="font-semibold mt-1">

                                        {movie.duration}

                                    </p>

                                </div>

                                <div className="bg-base-200 rounded-lg p-4">

                                    <p className="text-sm text-base-content/60">
                                        Language
                                    </p>

                                    <p className="font-semibold mt-1">

                                        {movie.language}

                                    </p>

                                </div>

                                <div className="bg-base-200 rounded-lg p-4">

                                    <p className="text-sm text-base-content/60">
                                        Release Date
                                    </p>

                                    <p className="font-semibold mt-1">

                                        {movie.releaseDate}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-12">

                <div className="w-[85%] mx-auto">

                    <div className="text-center mb-10">

                        <p className="text-primary font-semibold">
                            SHOW SCHEDULE
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            Choose Your Showtime
                        </h2>

                        <p className="mt-3 text-base-content/60">

                            Select a cinema branch and date to see
                            available showtimes.

                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-10 max-w-4xl mx-auto">

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Cinema Branch
                                </span>

                            </label>

                            <select
                                value={
                                    selectedBranch
                                }
                                onChange={(event) => {

                                    setSelectedBranch(
                                        event.target.value
                                    );

                                    setSelectedDate(
                                        "All"
                                    );

                                }}
                                className="select select-bordered w-full"
                            >

                                <option value="All">
                                    All Branches
                                </option>

                                {branches
                                    .filter(
                                        (branch) =>
                                            branch.status !==
                                            "Inactive"
                                    )
                                    .map(
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

                                                {" - "}

                                                {
                                                    branch.location
                                                }

                                            </option>

                                        )
                                    )}

                            </select>

                        </div>

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">
                                    Show Date
                                </span>

                            </label>

                            <select
                                value={
                                    selectedDate
                                }
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                                className="select select-bordered w-full"
                            >

                                <option value="All">
                                    All Dates
                                </option>

                                {availableDates.map(
                                    (date) => (

                                        <option
                                            key={date}
                                            value={date}
                                        >

                                            {date}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {filteredSchedules.length > 0 ? (

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {filteredSchedules.map(
                                (schedule) => {

                                    const branch =
                                        getBranchByID(
                                            schedule.branchID
                                        );

                                    const screen =
                                        getScreenByID(
                                            schedule.screenID,
                                            schedule.branchID
                                        );

                                    const currentTicketPrice =
                                        getTicketPrice(
                                            schedule.movieID,
                                            schedule.branchID,
                                            schedule.screenID
                                        );

                                    if (
                                        !branch ||
                                        !screen ||
                                        currentTicketPrice ===
                                        null
                                    ) {

                                        return null;

                                    }

                                    return (

                                        <div
                                            key={
                                                schedule.scheduleID
                                            }
                                            className="card bg-base-100 shadow-md"
                                        >

                                            <div className="card-body">

                                                <h3 className="card-title">

                                                    {
                                                        branch.branchName
                                                    }

                                                </h3>

                                                <div className="flex items-center gap-2 text-sm text-base-content/60">

                                                    <FaMapMarkerAlt />

                                                    {
                                                        branch.location
                                                    }

                                                </div>

                                                <div className="divider my-2"></div>

                                                <div className="flex items-center gap-3">

                                                    <FaCalendarAlt className="text-primary" />

                                                    <div>

                                                        <p className="text-xs text-base-content/60">
                                                            Date
                                                        </p>

                                                        <p className="font-semibold">

                                                            {
                                                                schedule.showDate
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex items-center gap-3 mt-3">

                                                    <FaClock className="text-primary" />

                                                    <div>

                                                        <p className="text-xs text-base-content/60">
                                                            Showtime
                                                        </p>

                                                        <p className="font-semibold">

                                                            {
                                                                formatTime(
                                                                    schedule.startTime
                                                                )
                                                            }

                                                            {" - "}

                                                            {
                                                                formatTime(
                                                                    schedule.endTime
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex justify-between items-center mt-4">

                                                    <div>

                                                        <p className="text-xs text-base-content/60">
                                                            Screen
                                                        </p>

                                                        <p className="font-semibold">

                                                            {
                                                                screen.screenName
                                                            }

                                                        </p>

                                                    </div>

                                                    <div className="text-right">

                                                        <p className="text-xs text-base-content/60">
                                                            Ticket Price
                                                        </p>

                                                        <p className="text-lg font-bold text-primary">

                                                            ৳
                                                            {
                                                                currentTicketPrice
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="card-actions mt-5">

                                                    <Link
                                                        to={`/booking/${movie.movieID}?schedule=${schedule.scheduleID}`}
                                                        className="btn btn-primary w-full"
                                                    >

                                                        Select Showtime

                                                    </Link>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    ) : (

                        <div className="text-center py-16 bg-base-100 rounded-xl">

                            <h3 className="text-2xl font-bold">

                                No Showtimes Available

                            </h3>

                            <p className="mt-2 text-base-content/60">

                                Try selecting another branch or date.

                            </p>

                        </div>

                    )}

                </div>

            </section>

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
            parts[1];

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

export default MovieDetails;