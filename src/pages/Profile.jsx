import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaEdit,
    FaLock,
} from "react-icons/fa";
import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function Profile() {

    const [customer, setCustomer] = useState(() => {
        return (
            JSON.parse(
                sessionStorage.getItem("user")
            ) || {}
        );
    });

    const [isEditing, setIsEditing] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isChangingPassword, setIsChangingPassword] =
        useState(false);

    const [isPasswordSaving, setIsPasswordSaving] =
        useState(false);

    const [formData, setFormData] = useState({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handlePasswordInputChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setPasswordData({
            ...passwordData,
            [name]: value,
        });

    };

    const handleSave = async (event) => {

        event.preventDefault();

        const updatedName =
            formData.name.trim();

        const updatedEmail =
            formData.email
                .trim()
                .toLowerCase();

        const updatedPhone =
            formData.phone.trim();

        if (!updatedName) {

            alert(
                "Please enter your name."
            );

            return;

        }

        if (!updatedEmail) {

            alert(
                "Please enter your email."
            );

            return;

        }

        if (!customer.userID) {

            alert(
                "User information was not found. Please login again."
            );

            return;

        }

        setIsSaving(true);

        try {

            const response =
                await fetch(
                    `${API_URL}/users/${customer.userID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name:
                                updatedName,
                            email:
                                updatedEmail,
                            phone:
                                updatedPhone,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Profile update failed."
                );

            }

            const updatedCustomer = {
                ...customer,
                userID:
                    data.user.id,
                name:
                    data.user.name,
                email:
                    data.user.email,
                phone:
                    data.user.phone,
                role:
                    data.user.role,
                status:
                    data.user.status,
            };

            sessionStorage.setItem(
                "user",
                JSON.stringify(
                    updatedCustomer
                )
            );

            setCustomer(
                updatedCustomer
            );

            setFormData({
                name:
                    updatedCustomer.name,
                email:
                    updatedCustomer.email,
                phone:
                    updatedCustomer.phone,
            });

            setIsEditing(false);

            alert(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Profile update failed:",
                error
            );

            alert(
                error.message ||
                "Something went wrong while updating your profile."
            );

        } finally {

            setIsSaving(false);

        }

    };

    const handleChangePassword = async (event) => {

        event.preventDefault();

        if (!customer.userID) {

            alert(
                "User information was not found. Please login again."
            );

            return;

        }

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            alert(
                "Please fill in all password fields."
            );

            return;

        }

        if (passwordData.newPassword.length < 6) {

            alert(
                "New password must be at least 6 characters long."
            );

            return;

        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            alert(
                "New password and confirm password do not match."
            );

            return;

        }

        if (
            passwordData.currentPassword ===
            passwordData.newPassword
        ) {

            alert(
                "New password must be different from your current password."
            );

            return;

        }

        setIsPasswordSaving(true);

        try {

            const response =
                await fetch(
                    `${API_URL}/users/${customer.userID}/password`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            currentPassword:
                                passwordData.currentPassword,
                            newPassword:
                                passwordData.newPassword,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Password change failed."
                );

            }

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setIsChangingPassword(false);

            alert(
                "Password changed successfully."
            );

        } catch (error) {

            console.error(
                "Password change failed:",
                error
            );

            alert(
                error.message ||
                "Something went wrong while changing your password."
            );

        } finally {

            setIsPasswordSaving(false);

        }

    };

    const handleCancel = () => {

        setFormData({
            name:
                customer.name || "",
            email:
                customer.email || "",
            phone:
                customer.phone || "",
        });

        setIsEditing(false);

    };

    const handleCancelPassword = () => {

        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setIsChangingPassword(false);

    };

    if (
        !customer ||
        Object.keys(customer).length === 0
    ) {

        return (

            <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">

                <div className="text-center">

                    <FaUser className="text-primary text-6xl mx-auto mb-5" />

                    <h1 className="text-3xl font-bold">
                        Profile Not Found
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        Please login to view your profile.
                    </p>

                    <Link
                        to="/login"
                        className="btn btn-primary mt-6"
                    >
                        Login
                    </Link>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-4xl mx-auto">

                <Link
                    to="/"
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Home
                </Link>

                <div className="text-center mb-10">

                    <p className="text-primary font-semibold">
                        CUSTOMER ACCOUNT
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        My Profile
                    </h1>

                    <p className="text-base-content/60 mt-3">
                        View and manage your account information.
                    </p>

                </div>

                <div className="card bg-base-100 shadow-md">

                    <div className="card-body p-8">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                            <div className="flex items-center gap-4">

                                <div className="bg-primary/10 text-primary p-5 rounded-full">
                                    <FaUser className="text-3xl" />
                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        {customer.name || "Customer"}
                                    </h2>

                                    <p className="text-base-content/60">
                                        MovieBook Customer
                                    </p>

                                </div>

                            </div>

                            {!isEditing && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsEditing(true)
                                    }
                                    className="btn btn-primary"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>

                            )}

                        </div>

                        <div className="divider"></div>

                        {!isEditing ? (

                            <div className="space-y-6">

                                <div className="flex items-center gap-4">

                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <FaUser className="text-primary" />
                                    </div>

                                    <div>

                                        <p className="text-sm text-base-content/60">
                                            Full Name
                                        </p>

                                        <p className="font-semibold text-lg">
                                            {customer.name || "Not available"}
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <FaEnvelope className="text-primary" />
                                    </div>

                                    <div>

                                        <p className="text-sm text-base-content/60">
                                            Email Address
                                        </p>

                                        <p className="font-semibold text-lg">
                                            {customer.email || "Not available"}
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="bg-base-200 p-4 rounded-lg">
                                        <FaPhone className="text-primary" />
                                    </div>

                                    <div>

                                        <p className="text-sm text-base-content/60">
                                            Phone Number
                                        </p>

                                        <p className="font-semibold text-lg">
                                            {customer.phone || "Not available"}
                                        </p>

                                    </div>

                                </div>

                                <div className="divider"></div>

                                {!isChangingPassword ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsChangingPassword(true)
                                        }
                                        className="btn btn-outline btn-primary w-full"
                                    >
                                        <FaLock />
                                        Change Password
                                    </button>

                                ) : (

                                    <form
                                        onSubmit={
                                            handleChangePassword
                                        }
                                        className="border border-base-300 rounded-xl p-6"
                                    >

                                        <div className="flex items-center gap-3 mb-5">

                                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                                <FaLock />
                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold">
                                                    Change Password
                                                </h3>

                                                <p className="text-sm text-base-content/60">
                                                    Enter your current password and choose a new password.
                                                </p>

                                            </div>

                                        </div>

                                        <div className="form-control">

                                            <label className="label">
                                                <span className="label-text">
                                                    Current Password
                                                </span>
                                            </label>

                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={
                                                    passwordData.currentPassword
                                                }
                                                onChange={
                                                    handlePasswordInputChange
                                                }
                                                className="input input-bordered w-full"
                                                placeholder="Enter current password"
                                                required
                                            />

                                        </div>

                                        <div className="form-control mt-5">

                                            <label className="label">
                                                <span className="label-text">
                                                    New Password
                                                </span>
                                            </label>

                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={
                                                    passwordData.newPassword
                                                }
                                                onChange={
                                                    handlePasswordInputChange
                                                }
                                                className="input input-bordered w-full"
                                                placeholder="Enter new password"
                                                minLength="6"
                                                required
                                            />

                                        </div>

                                        <div className="form-control mt-5">

                                            <label className="label">
                                                <span className="label-text">
                                                    Confirm New Password
                                                </span>
                                            </label>

                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordInputChange
                                                }
                                                className="input input-bordered w-full"
                                                placeholder="Confirm new password"
                                                minLength="6"
                                                required
                                            />

                                        </div>

                                        <div className="flex flex-col md:flex-row gap-3 mt-8">

                                            <button
                                                type="submit"
                                                disabled={
                                                    isPasswordSaving
                                                }
                                                className="btn btn-primary flex-1"
                                            >
                                                {isPasswordSaving
                                                    ? "Changing..."
                                                    : "Change Password"
                                                }
                                            </button>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancelPassword
                                                }
                                                disabled={
                                                    isPasswordSaving
                                                }
                                                className="btn btn-outline flex-1"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </form>

                                )}

                                <div className="divider"></div>

                                <div className="flex flex-col md:flex-row gap-3">

                                    <Link
                                        to="/my-bookings"
                                        className="btn btn-primary flex-1"
                                    >
                                        View My Bookings
                                    </Link>

                                    <Link
                                        to="/movies"
                                        className="btn btn-outline flex-1"
                                    >
                                        Browse Movies
                                    </Link>

                                </div>

                            </div>

                        ) : (

                            <form onSubmit={handleSave}>

                                <div className="form-control">

                                    <label className="label">
                                        <span className="label-text">
                                            Full Name
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="Enter your name"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-5">

                                    <label className="label">
                                        <span className="label-text">
                                            Email Address
                                        </span>
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-5">

                                    <label className="label">
                                        <span className="label-text">
                                            Phone Number
                                        </span>
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="01XXXXXXXXX"
                                    />

                                </div>

                                <div className="flex flex-col md:flex-row gap-3 mt-8">

                                    <button
                                        type="submit"
                                        disabled={
                                            isSaving
                                        }
                                        className="btn btn-primary flex-1"
                                    >

                                        {isSaving
                                            ? "Saving..."
                                            : "Save Changes"
                                        }

                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={
                                            isSaving
                                        }
                                        className="btn btn-outline flex-1"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Profile;