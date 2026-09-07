import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaFilm } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
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

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed.");
                return;
            }

            navigate("/login");
        } catch (error) {
            setError("Unable to connect to the server. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">

            <div className="card w-full max-w-lg bg-base-100 shadow-xl">

                <div className="card-body">

                    <div className="text-center mb-4">

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
                            Create Account
                        </h1>

                        <p className="text-base-content/60 mt-2">
                            Register to start booking your movie tickets.
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
                                    Full Name
                                </span>

                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

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

                        <div className="form-control mb-4">

                            <label className="label">

                                <span className="label-text">
                                    Phone
                                </span>

                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

                        <div className="form-control mb-4">

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
                                placeholder="Create a password"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

                        <div className="form-control mb-6">

                            <label className="label">

                                <span className="label-text">
                                    Confirm Password
                                </span>

                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="input input-bordered w-full"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Register
                        </button>

                    </form>

                    <div className="divider">
                        OR
                    </div>

                    <p className="text-center">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="link link-primary font-semibold"
                        >
                            Login
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

export default Register;