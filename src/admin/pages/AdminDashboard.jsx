import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaFilm,
    FaTags,
    FaBuilding,
    FaDesktop,
    FaChair,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaPercentage,
    FaUsers,
    FaTicketAlt,
    FaChartBar,
    FaUserShield,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [movies, setMovies] =
        useState([]);

    const [branches, setBranches] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {

        const loadDashboardData =
            async () => {

                try {

                    setLoading(true);
                    setErrorMessage("");

                    const [
                        moviesResponse,
                        branchesResponse,
                        usersResponse,
                        bookingsResponse,
                    ] = await Promise.all([
                        fetch(
                            `${API_URL}/movies`
                        ),
                        fetch(
                            `${API_URL}/branches`
                        ),
                        fetch(
                            `${API_URL}/users`
                        ),
                        fetch(
                            `${API_URL}/bookings`
                        ),
                    ]);

                    const [
                        moviesData,
                        branchesData,
                        usersData,
                        bookingsData,
                    ] = await Promise.all([
                        moviesResponse.json(),
                        branchesResponse.json(),
                        usersResponse.json(),
                        bookingsResponse.json(),
                    ]);

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

                    if (!usersResponse.ok) {

                        throw new Error(
                            usersData.message ||
                            "Failed to load users."
                        );

                    }

                    if (!bookingsResponse.ok) {

                        throw new Error(
                            bookingsData.message ||
                            "Failed to load bookings."
                        );

                    }

                    setMovies(
                        Array.isArray(
                            moviesData
                        )
                            ? moviesData
                            : []
                    );

                    setBranches(
                        Array.isArray(
                            branchesData
                        )
                            ? branchesData
                            : []
                    );

                    setUsers(
                        Array.isArray(
                            usersData
                        )
                            ? usersData
                            : []
                    );

                    setBookings(
                        Array.isArray(
                            bookingsData
                        )
                            ? bookingsData
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load dashboard data:",
                        error
                    );

                    setErrorMessage(
                        error.message ||
                        "Failed to load dashboard data."
                    );

                    setMovies([]);
                    setBranches([]);
                    setUsers([]);
                    setBookings([]);

                } finally {

                    setLoading(false);

                }

            };

        loadDashboardData();

    }, []);

    const totalMovies =
        movies.length;

    const totalBranches =
        branches.length;

    const totalUsers =
        users.length;

    const totalBookings =
        bookings.length;

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                String(
                    booking.status ||
                    ""
                ).toLowerCase() ===
                "confirmed"
        );

    const cancelledBookings =
        bookings.filter(
            (booking) =>
                String(
                    booking.status ||
                    ""
                ).toLowerCase() ===
                "cancelled"
        );

    const totalRevenue =
        confirmedBookings.reduce(
            (total, booking) =>
                total +
                Number(
                    booking.totalAmount ||
                    0
                ),
            0
        );

    const managementOptions = [
        {
            title: "Manage Movies",
            description:
                "Add, edit and delete movies.",
            icon: <FaFilm />,
            path: "/admin/movies",
        },
        {
            title: "Manage Genres",
            description:
                "Add, edit and delete movie genres.",
            icon: <FaTags />,
            path: "/admin/genres",
        },
        {
            title: "Manage Cinema Branches",
            description:
                "Manage cinema branch information.",
            icon: <FaBuilding />,
            path: "/admin/cinema-branches",
        },
        {
            title: "Manage Screens",
            description:
                "Manage cinema screens and halls.",
            icon: <FaDesktop />,
            path: "/admin/screens",
        },
        {
            title: "Manage Seats",
            description:
                "Manage seats for cinema screens.",
            icon: <FaChair />,
            path: "/admin/seats",
        },
        {
            title: "Manage Show Schedules",
            description:
                "Add, edit and delete show schedules.",
            icon: <FaCalendarAlt />,
            path: "/admin/schedules",
        },
        {
            title: "Manage Ticket Prices",
            description:
                "Manage ticket pricing information.",
            icon: <FaMoneyBillWave />,
            path: "/admin/ticket-prices",
        },
        {
            title: "Manage Promotions",
            description:
                "Manage movie booking promotions.",
            icon: <FaPercentage />,
            path: "/admin/promotions",
        },
        {
            title: "Manage Users",
            description:
                "View and manage registered users.",
            icon: <FaUsers />,
            path: "/admin/users",
        },
        {
            title: "Manage Bookings",
            description:
                "View and manage customer bookings.",
            icon: <FaTicketAlt />,
            path: "/admin/bookings",
        },
        {
            title: "Reports",
            description:
                "View system and booking reports.",
            icon: <FaChartBar />,
            path: "/admin/reports",
        },
    ];

    const handleOptionClick =
        (path) => {

            navigate(path);

        };

    return (

        <div className="min-h-screen bg-base-200">

            <div className="bg-base-100 shadow-md">

                <div className="w-[90%] max-w-7xl mx-auto">

                    <div className="navbar px-0">

                        <div className="flex-1">

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-lg bg-primary text-primary-content flex items-center justify-center">

                                    <FaUserShield className="text-xl" />

                                </div>

                                <div>

                                    <h1 className="text-xl font-bold">
                                        MovieBook Admin
                                    </h1>

                                    <p className="text-xs text-base-content/60">
                                        Administration Panel
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="w-[90%] max-w-7xl mx-auto py-10">

                <div className="mb-10">

                    <p className="text-primary font-semibold">
                        ADMINISTRATION
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        Admin Dashboard
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        Manage movies, cinemas, schedules,
                        bookings and other system information.
                    </p>

                </div>

                {errorMessage && (

                    <div className="alert alert-error mb-8">

                        <span>
                            {errorMessage}
                        </span>

                    </div>

                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Total Movies
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {loading
                                            ? "..."
                                            : totalMovies
                                        }
                                    </p>

                                </div>

                                <FaFilm className="text-primary text-3xl" />

                            </div>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Cinema Branches
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {loading
                                            ? "..."
                                            : totalBranches
                                        }
                                    </p>

                                </div>

                                <FaBuilding className="text-primary text-3xl" />

                            </div>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Registered Users
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {loading
                                            ? "..."
                                            : totalUsers
                                        }
                                    </p>

                                </div>

                                <FaUsers className="text-primary text-3xl" />

                            </div>

                        </div>

                    </div>

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
                                            : totalBookings
                                        }
                                    </p>

                                </div>

                                <FaTicketAlt className="text-primary text-3xl" />

                            </div>

                        </div>

                    </div>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <p className="text-sm text-base-content/60">
                                Confirmed Bookings
                            </p>

                            <p className="text-3xl font-bold mt-2 text-success">
                                {loading
                                    ? "..."
                                    : confirmedBookings.length
                                }
                            </p>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <p className="text-sm text-base-content/60">
                                Cancelled Bookings
                            </p>

                            <p className="text-3xl font-bold mt-2 text-error">
                                {loading
                                    ? "..."
                                    : cancelledBookings.length
                                }
                            </p>

                        </div>

                    </div>

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <p className="text-sm text-base-content/60">
                                Total Revenue
                            </p>

                            <p className="text-3xl font-bold mt-2 text-primary">
                                {loading
                                    ? "..."
                                    : `৳${totalRevenue}`
                                }
                            </p>

                        </div>

                    </div>

                </div>

                <div>

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold">
                            Management
                        </h2>

                        <p className="text-base-content/60 mt-1">
                            Select an option to manage the system.
                        </p>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {managementOptions.map(
                            (option) => (

                                <button
                                    key={
                                        option.title
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleOptionClick(
                                            option.path
                                        )
                                    }
                                    className="card bg-base-100 shadow-md hover:shadow-xl transition text-left"
                                >

                                    <div className="card-body">

                                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl">

                                            {option.icon}

                                        </div>

                                        <h3 className="card-title text-lg mt-2">
                                            {option.title}
                                        </h3>

                                        <p className="text-sm text-base-content/60">
                                            {option.description}
                                        </p>

                                        <div className="mt-2">

                                            <span className="text-primary text-sm font-semibold">
                                                Manage →
                                            </span>

                                        </div>

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;