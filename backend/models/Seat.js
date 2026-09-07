import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatID: {
        type: String,
        required: true,
        unique: true
    },
    screenID: {
        type: Number,
        required: true
    },
    branchID: {
        type: Number,
        required: true
    },
    screenName: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available"
    }
}, {
    timestamps: true
});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;