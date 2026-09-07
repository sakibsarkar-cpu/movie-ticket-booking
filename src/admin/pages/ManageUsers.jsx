import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaUsers,
    FaSearch,
    FaTrash,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "http://localhost:5000/api/users"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load users."
                    );
                }

                const data =
                    await response.json();

                setUsers(data);
            } catch (error) {
                console.error(
                    "Failed to load users:",
                    error
                );

                alert(
                    error.message ||
                        "Failed to load users."
                );
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleDeleteUser = async (userID) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/users/${userID}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "User deletion failed."
                );
            }

            setUsers(
                users.filter(
                    (user) =>
                        String(user._id) !==
                        String(userID)
                )
            );

            const loggedInUser =
                JSON.parse(
                    sessionStorage.getItem("user")
                );

            if (
                loggedInUser &&
                String(loggedInUser.userID) ===
                    String(userID)
            ) {
                sessionStorage.removeItem(
                    "user"
                );

                sessionStorage.removeItem(
                    "isLoggedIn"
                );

                sessionStorage.removeItem(
                    "token"
                );
            }

            alert(
                "User deleted successfully."
            );
        } catch (error) {
            console.error(
                "User deletion failed:",
                error
            );

            alert(
                error.message ||
                    "User deletion failed."
            );
        }
    };

    const handleToggleStatus = async (
        userID
    ) => {
        try {
            const response =
                await fetch(
                    `http://localhost:5000/api/users/${userID}/status`,
                    {
                        method: "PUT",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update user status."
                );
            }

            setUsers(
                users.map(
                    (user) =>
                        String(user._id) ===
                        String(userID)
                            ? {
                                  ...user,
                                  status:
                                      data.user
                                          .status,
                              }
                            : user
                )
            );

            const loggedInUser =
                JSON.parse(
                    sessionStorage.getItem("user")
                );

            if (
                loggedInUser &&
                String(loggedInUser.userID) ===
                    String(userID) &&
                data.user.status ===
                    "blocked"
            ) {
                sessionStorage.removeItem(
                    "user"
                );

                sessionStorage.removeItem(
                    "isLoggedIn"
                );

                sessionStorage.removeItem(
                    "token"
                );

                alert(
                    "User has been blocked and logged out."
                );

                return;
            }

            alert(data.message);
        } catch (error) {
            console.error(
                "Failed to update user status:",
                error
            );

            alert(
                error.message ||
                    "Failed to update user status."
            );
        }
    };

    const filteredUsers =
        users.filter((user) => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            return (
                user.name
                    ?.toLowerCase()
                    .includes(search) ||
                user.email
                    ?.toLowerCase()
                    .includes(search) ||
                user.phone
                    ?.toLowerCase()
                    .includes(search)
            );
        });

    const activeUsers =
        users.filter(
            (user) =>
                user.status === "active"
        ).length;

    const blockedUsers =
        users.filter(
            (user) =>
                user.status === "blocked"
        ).length;

    const formatRegistrationDate =
        (createdAt) => {
            if (!createdAt) {
                return "Not available";
            }

            return new Date(
                createdAt
            ).toISOString().split("T")[0];
        };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-base-content/60">
                        Loading users...
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

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <FaUsers className="text-2xl" />
                        </div>

                        <div>
                            <p className="text-primary font-semibold text-sm">
                                ADMINISTRATION
                            </p>

                            <h1 className="text-3xl font-bold">
                                Manage Users
                            </h1>

                            <p className="text-base-content/60 mt-1">
                                View and manage registered customers.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <p className="text-sm text-base-content/60">
                                Total Users
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {users.length}
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <p className="text-sm text-base-content/60">
                                Active Users
                            </p>

                            <p className="text-3xl font-bold text-success mt-2">
                                {activeUsers}
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <p className="text-sm text-base-content/60">
                                Blocked Users
                            </p>

                            <p className="text-3xl font-bold text-error mt-2">
                                {blockedUsers}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Registered Users
                                </h2>

                                <p className="text-sm text-base-content/60 mt-1">
                                    Total Users:{" "}
                                    {users.length}
                                </p>
                            </div>

                            <div className="relative w-full md:w-80">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />

                                <input
                                    type="text"
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchTerm(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search by name, email or phone"
                                    className="input input-bordered w-full pl-10"
                                />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Registration Date
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
                                    {filteredUsers.map(
                                        (
                                            user
                                        ) => (
                                            <tr
                                                key={
                                                    user._id
                                                }
                                            >
                                                <td>
                                                    <span className="text-xs">
                                                        {
                                                            user._id
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="font-semibold">
                                                        {
                                                            user.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        user.email
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        user.phone ||
                                                        "Not provided"
                                                    }
                                                </td>

                                                <td>
                                                    {formatRegistrationDate(
                                                        user.createdAt
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            user.status ===
                                                            "active"
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {user.status ===
                                                        "active"
                                                            ? "Active"
                                                            : "Blocked"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user._id
                                                                )
                                                            }
                                                            className={`btn btn-sm ${
                                                                user.status ===
                                                                "active"
                                                                    ? "btn-outline btn-warning"
                                                                    : "btn-outline btn-success"
                                                            }`}
                                                        >
                                                            {user.status ===
                                                            "active" ? (
                                                                <>
                                                                    <FaUserTimes />
                                                                    Block
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaUserCheck />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user._id
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
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length ===
                            0 &&
                            users.length > 0 && (
                                <div className="text-center py-10">
                                    <FaSearch className="text-5xl mx-auto text-base-content/30" />

                                    <h3 className="text-xl font-bold mt-4">
                                        No Users Found
                                    </h3>

                                    <p className="text-base-content/60 mt-2">
                                        Try searching with a different name, email or phone number.
                                    </p>
                                </div>
                            )}

                        {users.length ===
                            0 && (
                            <div className="text-center py-10">
                                <FaUsers className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Registered Users
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Registered customers will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;