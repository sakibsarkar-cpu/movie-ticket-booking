import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaFilm, FaUserShield } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        const adminEmail = "admin@moviebook.com";
        const adminPassword = "admin123";

        if (email === adminEmail && password === adminPassword) {
            const adminUser = {
                userID: "admin",
                name: "Admin",
                email: adminEmail,
                role: "admin",
                status: "Active",
            };

            sessionStorage.setItem(
                "user",
                JSON.stringify(adminUser)
            );

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            sessionStorage.removeItem(
                "isLoggedIn"
            );

            sessionStorage.removeItem(
                "token"
            );

            navigate("/admin/dashboard");

            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Invalid email or password."
                );

                return;
            }

            if (data.user.role !== "customer") {
                setError("Invalid customer account.");

                return;
            }

            const customerUser = {
                userID: data.user.id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
                role: data.user.role,
                status: data.user.status,
            };

            sessionStorage.setItem(
                "user",
                JSON.stringify(customerUser)
            );

            sessionStorage.setItem(
                "token",
                data.token
            );

            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            navigate("/");
        } catch (error) {
            setError(
                "Unable to connect to the server. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">

            <div className="card w-full max-w-md bg-base-100 shadow-xl">

                <div className="card-body">

                    <div className="text-center mb-5">

                        <div className="flex justify-center items-center gap-2 mb-3">

                            <FaFilm
                                className="text-primary"
                                size={28}
                            />

                            <span className="text-2xl font-bold">
                                MovieBook
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold">
                            Welcome Back
                        </h1>

                        <p className="text-base-content/60 mt-2">
                            Login to continue to MovieBook.
                        </p>

                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">

                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-control mb-4">

                            <label className="label">

                                <span className="label-text">
                                    Email
                                </span>

                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

                        <div className="form-control mb-6">

                            <label className="label">

                                <span className="label-text">
                                    Password
                                </span>

                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Login
                        </button>

                    </form>

                    <div className="divider">
                        OR
                    </div>

                    <p className="text-center">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="link link-primary font-semibold"
                        >
                            Register
                        </Link>

                    </p>

                    <p className="text-center mt-3">

                        <Link
                            to="/"
                            className="link link-hover"
                        >
                            Back to Home
                        </Link>

                    </p>

                   
                </div>

            </div>

        </div>
    );
}

export default Login;