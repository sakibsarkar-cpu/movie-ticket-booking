import mongoose from "mongoose";

const showScheduleSchema = new mongoose.Schema({
    scheduleID: {
        type: Number,
        required: true,
        unique: true
    },
    movieID: {
        type: Number,
        required: true
    },
    movieTitle: {
        type: String,
        default: ""
    },
    branchID: {
        type: Number,
        required: true
    },
    branchName: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    screenID: {
        type: Number,
        required: true
    },
    screenName: {
        type: String,
        default: ""
    },
    showDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true
});

const ShowSchedule = mongoose.model(
    "ShowSchedule",
    showScheduleSchema
);

export default ShowSchedule;