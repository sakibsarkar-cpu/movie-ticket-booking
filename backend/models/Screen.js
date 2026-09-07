import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
    screenID: {
        type: Number,
        required: true,
        unique: true
    },
    screenName: {
        type: String,
        required: true,
        trim: true
    },
    branchID: {
        type: Number,
        required: true
    },
    capacity: {
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

const Screen = mongoose.model("Screen", screenSchema);

export default Screen;