import mongoose from "mongoose";

const cinemaBranchSchema = new mongoose.Schema({
    branchID: {
        type: Number,
        required: true,
        unique: true
    },
    branchName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true
});

const CinemaBranch = mongoose.model(
    "CinemaBranch",
    cinemaBranchSchema
);

export default CinemaBranch;