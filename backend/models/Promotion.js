import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    promotionID: {
        type: Number,
        required: true,
        unique: true
    },
    promotionCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        default: ""
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    movieScope: {
        type: String,
        enum: ["all", "selected"],
        default: "all"
    },
    applicableMovieIDs: {
        type: [Number],
        default: []
    },
    applicableDay: {
        type: String,
        default: "All Days"
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
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

const Promotion = mongoose.model(
    "Promotion",
    promotionSchema
);

export default Promotion;