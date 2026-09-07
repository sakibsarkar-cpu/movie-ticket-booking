import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketID: {
        type: String,
        required: true,
        unique: true
    },
    bookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    movieID: {
        type: Number,
        required: true
    },
    movieTitle: {
        type: String,
        required: true
    },
    scheduleID: {
        type: Number,
        required: true
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
        default: ""
    },
    seatIDs: {
        type: [String],
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    promotionCode: {
        type: String,
        default: ""
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionID: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Failed", "Pending"],
        default: "Pending"
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Cancelled"],
        default: "Active"
    }
}, {
    timestamps: true
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;