import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        default: ""
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
    selectedSeats: {
        type: [String],
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
    status: {
        type: String,
        enum: ["Confirmed", "Cancelled", "Pending"],
        default: "Pending"
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;