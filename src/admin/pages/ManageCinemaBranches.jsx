import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaBuilding,
    FaPlus,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function ManageCinemaBranches() {

    const [branches, setBranches] = useState([]);

    const [showForm, setShowForm] =
        useState(false);

    const [editingBranch, setEditingBranch] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [formData, setFormData] =
        useState({
            branchName: "",
            location: "",
            contact: "",
            status: "Active",
        });

    const fetchBranches = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/branches"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch cinema branches"
                );
            }

            const data = await response.json();

            setBranches(data);

        } catch (error) {

            console.error(error);

            alert(
                "Failed to load cinema branches."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

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

    const handleAddBranch = () => {

        setEditingBranch(null);

        setFormData({
            branchName: "",
            location: "",
            contact: "",
            status: "Active",
        });

        setShowForm(true);

    };

    const handleEditBranch = (branch) => {

        setEditingBranch(branch);

        setFormData({
            branchName:
                branch.branchName,

            location:
                branch.location,

            contact:
                branch.contact,

            status:
                branch.status,
        });

        setShowForm(true);

    };

    const handleDeleteBranch = async (branchID) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this cinema branch?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/branches/${branchID}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete cinema branch"
                );
            }

            setBranches(
                branches.filter(
                    (branch) =>
                        branch.branchID !==
                        branchID
                )
            );

            alert(
                "Cinema branch deleted successfully."
            );

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to delete cinema branch."
            );

        }

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedBranchName =
            formData.branchName.trim();

        const trimmedLocation =
            formData.location.trim();

        const trimmedContact =
            formData.contact.trim();

        if (!trimmedBranchName) {

            alert(
                "Please enter branch name."
            );

            return;

        }

        if (!trimmedLocation) {

            alert(
                "Please enter branch location."
            );

            return;

        }

        if (!trimmedContact) {

            alert(
                "Please enter contact number."
            );

            return;

        }

        const duplicateBranch =
            branches.find(
                (branch) =>
                    branch.branchName
                        .toLowerCase() ===
                    trimmedBranchName
                        .toLowerCase() &&
                    branch.branchID !==
                    editingBranch?.branchID
            );

        if (duplicateBranch) {

            alert(
                "This cinema branch already exists."
            );

            return;

        }

        const branchData = {

            branchName:
                trimmedBranchName,

            location:
                trimmedLocation,

            contact:
                trimmedContact,

            status:
                formData.status,

        };

        try {

            if (editingBranch) {

                const response = await fetch(
                    `http://localhost:5000/api/branches/${editingBranch.branchID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify(
                                branchData
                            ),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to update cinema branch"
                    );
                }

                setBranches(
                    branches.map(
                        (branch) =>
                            branch.branchID ===
                            editingBranch.branchID
                                ? data.branch
                                : branch
                    )
                );

                alert(
                    "Cinema branch updated successfully."
                );

            } else {

                const newBranchID =
                    branches.length > 0
                        ? Math.max(
                            ...branches.map(
                                (branch) =>
                                    Number(
                                        branch.branchID
                                    ) || 0
                            )
                        ) + 1
                        : 1;

                const response = await fetch(
                    "http://localhost:5000/api/branches",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                branchID:
                                    newBranchID,
                                ...branchData,
                            }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to add cinema branch"
                    );
                }

                setBranches([
                    ...branches,
                    data.branch,
                ]);

                alert(
                    "Cinema branch added successfully."
                );

            }

            setShowForm(false);

            setEditingBranch(null);

            setFormData({
                branchName: "",
                location: "",
                contact: "",
                status: "Active",
            });

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to save cinema branch."
            );

        }

    };

    const handleCancel = () => {

        setShowForm(false);

        setEditingBranch(null);

        setFormData({
            branchName: "",
            location: "",
            contact: "",
            status: "Active",
        });

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

                                <FaBuilding className="text-2xl" />

                            </div>

                            <div>

                                <p className="text-primary font-semibold text-sm">
                                    ADMINISTRATION
                                </p>

                                <h1 className="text-3xl font-bold">
                                    Manage Cinema Branches
                                </h1>

                                <p className="text-base-content/60 mt-1">
                                    Add, edit and delete cinema branch information.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleAddBranch}
                        className="btn btn-primary"
                    >

                        <FaPlus />

                        Add Branch

                    </button>

                </div>

                {showForm && (

                    <div className="card bg-base-100 shadow-md mb-8">

                        <div className="card-body">

                            <h2 className="text-2xl font-bold">

                                {editingBranch
                                    ? "Edit Cinema Branch"
                                    : "Add Cinema Branch"}

                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Enter cinema branch information.
                            </p>

                            <div className="divider"></div>

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="form-control">

                                    <label className="label">

                                        <span className="label-text">
                                            Branch Name
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        name="branchName"
                                        value={
                                            formData.branchName
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="MovieBook Dhanmondi"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-4">

                                    <label className="label">

                                        <span className="label-text">
                                            Location
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Dhanmondi, Dhaka"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                </div>

                                <div className="form-control mt-4">

                                    <label className="label">

                                        <span className="label-text">
                                            Contact Number
                                        </span>

                                    </label>

                                    <input
                                        type="tel"
                                        name="contact"
                                        value={
                                            formData.contact
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="01700000000"
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

                                        {editingBranch
                                            ? "Update Branch"
                                            : "Add Branch"}

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

                        <div>

                            <h2 className="text-2xl font-bold">
                                Cinema Branch List
                            </h2>

                            <p className="text-sm text-base-content/60 mt-1">
                                Total Branches: {branches.length}
                            </p>

                        </div>

                        <div className="divider"></div>

                        {loading ? (

                            <div className="text-center py-10">

                                <span className="loading loading-spinner loading-lg"></span>

                                <p className="mt-3 text-base-content/60">
                                    Loading cinema branches...
                                </p>

                            </div>

                        ) : branches.length > 0 ? (

                            <div className="overflow-x-auto">

                                <table className="table w-full">

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Branch
                                            </th>

                                            <th>
                                                Location
                                            </th>

                                            <th>
                                                Contact
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

                                        {branches.map(
                                            (branch) => (

                                                <tr
                                                    key={
                                                        branch.branchID
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            branch.branchID
                                                        }
                                                    </td>

                                                    <td>

                                                        <div className="font-semibold">
                                                            {
                                                                branch.branchName
                                                            }
                                                        </div>

                                                    </td>

                                                    <td>
                                                        {
                                                            branch.location
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            branch.contact
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                                branch.status ===
                                                                "Active"
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >

                                                            {
                                                                branch.status
                                                            }

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="flex gap-2">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditBranch(
                                                                        branch
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
                                                                    handleDeleteBranch(
                                                                        branch.branchID
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

                                <FaBuilding className="text-5xl mx-auto text-base-content/30" />

                                <h3 className="text-xl font-bold mt-4">
                                    No Cinema Branches
                                </h3>

                                <p className="text-base-content/60 mt-2">
                                    Add a cinema branch to get started.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleAddBranch}
                                    className="btn btn-primary mt-4"
                                >

                                    <FaPlus />

                                    Add Branch

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ManageCinemaBranches;