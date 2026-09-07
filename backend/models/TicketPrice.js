import mongoose from "mongoose";

const ticketPriceSchema = new mongoose.Schema({
    priceID: {
        type: Number,
        required: true,
        unique: true
    },
    movieID: {
        type: Number,
        required: true
    },
    branchID: {
        type: Number,
        required: true
    },
    screenID: {
        type: Number,
        required: true
    },
    price: {
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

const TicketPrice = mongoose.model(
    "TicketPrice",
    ticketPriceSchema
);

export default TicketPrice;