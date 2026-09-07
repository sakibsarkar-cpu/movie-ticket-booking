import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    bookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    amount: {
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
    paymentMethod: {
        type: String,
        required: true
    },
    transactionID: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Failed", "Pending"],
        default: "Pending"
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;