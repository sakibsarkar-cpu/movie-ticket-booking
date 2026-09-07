import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [movies, setMovies] = useState([]);

    const isCustomerLoggedIn =
        sessionStorage.getItem("isLoggedIn") === "true";

    const isAdminLoggedIn =
        sessionStorage.getItem("adminLoggedIn") === "true";

    const user =
        JSON.parse(sessionStorage.getItem("user")) || {};

    const isLoggedIn =
        isCustomerLoggedIn || isAdminLoggedIn;

    const loadMovies = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/movies/active"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load movies."
                );
            }

            const data = await response.json();

            setMovies(
                Array.isArray(data)
                    ? data.map((movie) => ({
                        ...movie,
                        genre:
                            movie.genre ||
                            movie.genreName ||
                            "",
                    }))
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load movies for search:",
                error
            );

            setMovies([]);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    useEffect(() => {
        if (showSearch) {
            loadMovies();
        }
    }, [showSearch]);

    const filteredMovies = movies.filter((movie) =>
        String(movie.title || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("adminLoggedIn");

        setIsOpen(false);
        setShowSearch(false);
        setSearchText("");

        navigate("/login");
    };

    const handleMovieClick = (movieID) => {
        setSearchText("");
        setShowSearch(false);

        navigate(`/movies/${movieID}`);
    };

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
        setSearchText("");
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-6">

            <div className="navbar-start">

                <Link
                    to="/"
                    className="text-2xl font-bold text-primary"
                >
                    MovieBook
                </Link>

            </div>

            <div className="navbar-center hidden lg:flex">

                <ul className="menu menu-horizontal px-1 gap-2">

                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/movies">
                            Movies
                        </Link>
                    </li>

                    <li>
                        <Link to="/upcoming">
                            Upcoming Movies
                        </Link>
                    </li>

                    <li>
                        <Link to="/ai-recommendations">
                            AI Recommendations
                        </Link>
                    </li>

                    <li>
                        <Link to="/ai-chatbot">
                            AI Assistant
                        </Link>
                    </li>

                    {isCustomerLoggedIn && (
                        <li>
                            <Link to="/my-bookings">
                                My Bookings
                            </Link>
                        </li>
                    )}

                </ul>

            </div>

            <div className="navbar-end gap-3 relative">

                {showSearch && (
                    <div className="relative">

                        <input
                            type="text"
                            placeholder="Search movie name..."
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                            autoFocus
                            className="input input-bordered input-sm w-56"
                        />

                        {searchText.trim() !== "" && (
                            <div className="absolute right-0 top-10 z-50 w-72 bg-base-100 border rounded-lg shadow-lg overflow-hidden">

                                {filteredMovies.length > 0 ? (
                                    filteredMovies.map(
                                        (movie) => (
                                            <button
                                                key={
                                                    movie.movieID
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleMovieClick(
                                                        movie.movieID
                                                    )
                                                }
                                                className="w-full text-left px-4 py-3 hover:bg-base-200 flex items-center gap-3"
                                            >

                                                {movie.image && (
                                                    <img
                                                        src={
                                                            movie.image
                                                        }
                                                        alt={
                                                            movie.title
                                                        }
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                )}

                                                <div>

                                                    <p className="font-semibold">
                                                        {movie.title}
                                                    </p>

                                                    <p className="text-sm opacity-70">
                                                        {Array.isArray(
                                                            movie.genre
                                                        )
                                                            ? movie.genre.join(
                                                                ", "
                                                            )
                                                            : movie.genre}
                                                    </p>

                                                </div>

                                            </button>
                                        )
                                    )
                                ) : (
                                    <p className="px-4 py-3 text-sm opacity-70">
                                        No movies found
                                    </p>
                                )}

                            </div>
                        )}

                    </div>
                )}

                <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    onClick={handleSearchClick}
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                        />

                    </svg>

                </button>

                {!isLoggedIn ? (

                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >
                        Login
                    </Link>

                ) : isAdminLoggedIn ? (

                    <div className="dropdown dropdown-end">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                setIsOpen(!isOpen)
                            }
                        >
                            Admin
                        </button>

                        {isOpen && (
                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow-lg">

                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                    >
                                        Admin Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        Logout
                                    </button>
                                </li>

                            </ul>
                        )}

                    </div>

                ) : (

                    <div className="dropdown dropdown-end">

                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() =>
                                setIsOpen(!isOpen)
                            }
                        >
                            {user.name ||
                                user.email ||
                                "Account"}
                        </button>

                        {isOpen && (
                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[50] mt-3 w-52 p-2 shadow-lg">

                                <li>
                                    <Link
                                        to="/profile"
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                    >
                                        My Profile
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/my-bookings"
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                    >
                                        My Bookings
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/ai-chatbot"
                                        onClick={() =>
                                            setIsOpen(false)
                                        }
                                    >
                                        AI Assistant
                                    </Link>
                                </li>

                                <li>
                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        Logout
                                    </button>
                                </li>

                            </ul>
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Navbar;