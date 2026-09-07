import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaDesktop,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function ManageScreens() {

    const [branches, setBranches] = useState([]);

    const [screens, setScreens] = useState([]);

    const [showForm, setShowForm] =
        useState(false);

    const [editingScreen, setEditingScreen] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [formData, setFormData] =
        useState({
            screenName: "",
            branchID: "",
            capacity: 48,
            status: "Active",
        });

    const fetchData = async () => {
        try {

            setLoading(true);

            const [
                branchesResponse,
                screensResponse,
            ] = await Promise.all([
                fetch(
                    "http://localhost:5000/api/branches"
                ),
                fetch(
                    "http://localhost:5000/api/screens"
                ),
            ]);

            if (
                !branchesResponse.ok ||
                !screensResponse.ok
            ) {
                throw new Error(
                    "Failed to fetch screen data"
                );
            }

            const branchesData =
                await branchesResponse.json();

            const screensData =
                await screensResponse.json();

            setBranches(branchesData);

            setScreens(screensData);

            if (branchesData.length > 0) {

                setFormData((previousData) => ({
                    ...previousData,
                    branchID:
                        previousData.branchID ||
                        Number(
                            branchesData[0].branchID
                        ),
                }));

            }

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load screens and cinema branches."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;

            setFormData({
                ...formData,
                [name]:
                    name === "branchID" ||
                    name === "capacity"
                        ? Number(value)
                        : value,
            });

        };

    const handleAddScreen =
        () => {

            setEditingScreen(null);

            setFormData({
                screenName: "",
                branchID:
                    branches.length > 0
                        ? Number(
                            branches[0].branchID
                        )
                        : "",
                capacity: 48,
                status: "Active",
            });

            setShowForm(true);

        };

    const handleEditScreen =
        (screen) => {

            setEditingScreen(screen);

            setFormData({
                screenName:
                    screen.screenName,

                branchID:
                    Number(
                        screen.branchID
                    ),

                capacity:
                    Number(
                        screen.capacity
                    ),

                status:
                    screen.status || "Active",
            });

            setShowForm(true);

        };

    const handleDeleteScreen =
        async (screenID) => {

            const confirmDelete =
                window.confirm(
                    "Are you sure you want to delete this screen?"
                );

            if (!confirmDelete) {
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:5000/api/screens/${screenID}`,
                    {
                        method: "DELETE",
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to delete screen"
                    );
                }

                setScreens(
                    screens.filter(
                        (screen) =>
                            Number(
                                screen.screenID
                            ) !==
                            Number(screenID)
                    )
                );

                alert(
                    "Screen deleted successfully."
                );

            } catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Failed to delete screen."
                );

            }

        };

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            const trimmedScreenName =
                formData.screenName.trim();

            if (!trimmedScreenName) {

                alert(
                    "Please enter screen name."
                );

                return;

            }

            if (!formData.branchID) {

                alert(
                    "Please select a cinema branch."
                );

                return;

            }

            if (
                !formData.capacity ||
                Number(formData.capacity) <= 0
            ) {

                alert(
                    "Please enter a valid seat capacity."
                );

                return;

            }

            const duplicateScreen =
                screens.find(
                    (screen) =>
                        screen.screenName
                            .toLowerCase() ===
                        trimmedScreenName
                            .toLowerCase() &&
                        Number(screen.branchID) ===
                        Number(formData.branchID) &&
                        Number(screen.screenID) !==
                        Number(
                            editingScreen?.screenID
                        )
                );

            if (duplicateScreen) {

                alert(
                    "This screen already exists in the selected cinema branch."
                );

                return;

            }

            const screenData = {
                screenName:
                    trimmedScreenName,

                branchID:
                    Number(
                        formData.branchID
                    ),

                capacity:
                    Number(
                        formData.capacity
                    ),

                status:
                    formData.status,
            };

            try {

                if (editingScreen) {

                    const response =
                        await fetch(
                            `http://localhost:5000/api/screens/${editingScreen.screenID}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body:
                                    JSON.stringify(
                                        screenData
                                    ),
                            }
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Failed to update screen"
                        );
                    }

                    setScreens(
                        screens.map(
                            (screen) =>
                                Number(
                                    screen.screenID
                                ) ===
                                Number(
                                    editingScreen.screenID
                                )
                                    ? data.screen
                                    : screen
                        )
                    );

                    alert(
                        "Screen updated successfully."
                    );

                } else {

                    const newScreenID =
                        screens.length > 0
                            ? Math.max(
                                ...screens.map(
                                    (screen) =>
                                        Number(
                                            screen.screenID
                                        ) || 0
                                )
                            ) + 1
                            : 1;

                    const response =
                        await fetch(
                            "http://localhost:5000/api/screens",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },
                                body:
                                    JSON.stringify({
                                        screenID:
                                            newScreenID,
                                        ...screenData,
                                    }),
                            }
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Failed to add screen"
                        );
                    }

                    setScreens([
                        ...screens,
                        data.screen,
                    ]);

                    alert(
                        "Screen added successfully."
                    );

                }

                handleCancel();

            } catch (error) {

                console.error(error);

                alert(
                    error.message ||
                    "Failed to save screen."
                );

            }

        };

    const handleCancel =
        () => {

            setShowForm(false);

            setEditingScreen(null);

            setFormData({
                screenName: "",
                branchID:
                    branches.length > 0
                        ? Number(
                            branches[0].branchID
                        )
                        : "",
                capacity: 48,
                status: "Active",
            });

        };

    const getBranchName =
        (branchID) => {

            const branch =
                branches.find(
                    (item) =>
                        Number(
                            item.branchID
                        ) ===
                        Number(
                            branchID
                        )
                );

            return branch
                ? branch.branchName
                : "Unknown Branch";

        };

    return (

        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-6xl mx-auto">

                <Link
                    to="/admin/dashboard"
                    className="btn btn-ghost btn-sm mb-6"
                >

                    <FaArrowLeft />

                    Back to Dashboard

                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="bg-primary/10 text-primary p-3 rounded-lg">

                                <FaDesktop className="text-2xl" />

                            </div>

                            <div>

                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Screens
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Add, edit and delete cinema screen information.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleAddScreen}
                        className="btn btn-primary"
                    >

                        <FaPlus />

                        Add Screen

                    </button>

                </div>

                {showForm && (

                    <div className="card bg-base-100 shadow-md mb-8">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold">

                                {editingScreen
                                    ? "Edit Screen"
                                    : "Add Screen"}

                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Enter cinema screen information.
                            </p>

                            <div className="divider"></div>

                            <form onSubmit={handleSubmit}>

                                <div className="form-control">

                                    <label className="label">

                                        <span className="label-text">
                                            Screen Name
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        name="screenName"
                                        value={
                                            formData.screenName
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Screen 1"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-4">

                                    <label className="label">

                                        <span className="label-text">
                                            Cinema Branch
                                        </span>

                                    </label>

                                    <select
                                        name="branchID"
                                        value={
                                            formData.branchID
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                        required
                                    >

                                        {branches.map(
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

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="form-control mt-4">

                                    <label className="label">

                                        <span className="label-text">
                                            Seat Capacity
                                        </span>

                                    </label>

                                    <input
                                        type="number"
                                        name="capacity"
                                        value={
                                            formData.capacity
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-4">

                                    <label className="label">

                                        <span className="label-text">
                                            Status
                                        </span>

                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        className="select select-bordered w-full"
                                    >

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                                <div className="flex gap-3 mt-6">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >

                                        {editingScreen
                                            ? "Update Screen"
                                            : "Add Screen"}

                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-outline"
                                    >

                                        Cancel

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                <div className="card bg-base-100 shadow-md">

                    <div className="card-body">

                        <h2 className="text-2xl font-bold">
                            Screen List
                        </h2>

                        <p className="text-sm text-base-content/60 mt-1">
                            Total Screens: {screens.length}
                        </p>

                        <div className="divider"></div>

                        {loading ? (

                            <div className="text-center py-10">

                                <span className="loading loading-spinner loading-lg"></span>

                                <p className="mt-3 text-base-content/60">
                                    Loading screens...
                                </p>

                            </div>

                        ) : screens.length > 0 ? (

                            <div className="overflow-x-auto">

                                <table className="table w-full">

                                    <thead>

                                        <tr>

                                            <th>ID</th>

                                            <th>Screen</th>

                                            <th>Cinema Branch</th>

                                            <th>Capacity</th>

                                            <th>Status</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {screens.map(
                                            (screen) => (

                                                <tr
                                                    key={
                                                        screen.screenID
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            screen.screenID
                                                        }
                                                    </td>

                                                    <td className="font-semibold">
                                                        {
                                                            screen.screenName
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            getBranchName(
                                                                screen.branchID
                                                            )
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            screen.capacity
                                                        } seats
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                                screen.status ===
                                                                "Active"
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >

                                                            {
                                                                screen.status
                                                            }

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="flex gap-2">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditScreen(
                                                                        screen
                                                                    )
                                                                }
                                                                className="btn btn-outline btn-primary btn-sm"
                                                            >

                                                                <FaEdit />

                                                                Edit

                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteScreen(
                                                                        screen.screenID
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

                        ) : (

                            <div className="text-center py-10">

                                <FaDesktop className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Screens
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a cinema screen to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddScreen}
                                    className="btn btn-primary mt-4"
                                >

                                    <FaPlus />

                                    Add Screen

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ManageScreens;