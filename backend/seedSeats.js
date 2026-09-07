import mongoose from "mongoose";
import dotenv from "dotenv";
import Seat from "./models/Seat.js";

dotenv.config();

const seats = [];

const addSeats = (screenID, screenName, branchID, branchName, rows, seatsPerRow) => {
    rows.forEach((row) => {
        for (let number = 1; number <= seatsPerRow; number++) {
            const seatNumber = `${row}${number}`;

            seats.push({
                seatID: `${screenID}-${seatNumber}`,
                screenID,
                screenName,
                seatNumber,
                status: "Available",
                branchName,
                branchID
            });
        }
    });
};

addSeats(
    1,
    "Screen 1",
    1,
    "MovieBook Dhanmondi",
    ["A", "B", "C", "D", "E", "F"],
    8
);

seats.push({
    seatID: "1-G1",
    screenID: 1,
    screenName: "Screen 1",
    seatNumber: "G1",
    status: "Available",
    branchName: "MovieBook Dhanmondi",
    branchID: 1
});

seats.push({
    seatID: "1-G2",
    screenID: 1,
    screenName: "Screen 1",
    seatNumber: "G2",
    status: "Available",
    branchName: "MovieBook Dhanmondi",
    branchID: 1
});

addSeats(
    2,
    "Screen 2",
    1,
    "MovieBook Dhanmondi",
    ["A", "B", "C", "D", "E", "F"],
    8
);

addSeats(
    3,
    "Screen 1",
    2,
    "MovieBook Bashundhara",
    ["A", "B", "C", "D", "E", "F"],
    8
);

addSeats(
    4,
    "Screen 3",
    3,
    "MovieBook Uttara",
    ["A", "B", "C", "D", "E", "F"],
    8
);

seats.push({
    seatID: "5-A1",
    screenID: 5,
    branchID: 4,
    screenName: "Screen 4",
    branchName: "MovieBook Mirpur",
    seatNumber: "A1",
    status: "Available"
});

seats.push({
    seatID: "6-F8",
    screenID: 6,
    branchID: 5,
    screenName: "Screen 4",
    branchName: "MovieBook  Gulshan",
    seatNumber: "F8",
    status: "Available"
});

seats.push({
    seatID: "5-A2",
    screenID: 5,
    branchID: 4,
    screenName: "Screen 4",
    branchName: "MovieBook Mirpur",
    seatNumber: "A2",
    status: "Available"
});

const seedSeats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Seat.deleteMany({});

        await Seat.insertMany(seats);

        console.log(`${seats.length} seats inserted successfully`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Seat seeding failed:", error.message);
        process.exit(1);
    }
};

seedSeats();