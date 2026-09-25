import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);
            },
            message: "Name can contain letters and spaces only"
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(value);
            },
            message: "Please enter a valid Gmail address"
        }
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: "",
        validate: {
            validator: function (value) {
                return value === "" || /^01[3-9]\d{8}$/.test(value);
            },
            message: "Phone number must be a valid 11-digit Bangladesh number"
        }
    },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    }
}, {
    timestamps: true // This tells Mongoose to automatically maintain createdAt and updatedAt
});

const User = mongoose.model("User", userSchema);

export default User;