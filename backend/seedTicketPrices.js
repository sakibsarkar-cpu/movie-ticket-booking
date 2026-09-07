import mongoose from "mongoose";
import dotenv from "dotenv";
import TicketPrice from "./models/TicketPrice.js";

dotenv.config();

const ticketPrices = [
    {
        priceID: 1,
        movieID: 1,
        branchID: 1,
        screenID: 1,
        price: 350,
        status: "Active"
    },
    {
        priceID: 2,
        movieID: 1,
        branchID: 1,
        screenID: 2,
        price: 400,
        status: "Active"
    },
    {
        priceID: 3,
        movieID: 1,
        branchID: 2,
        screenID: 3,
        price: 450,
        status: "Active"
    },
    {
        priceID: 4,
        movieID: 1,
        branchID: 3,
        screenID: 4,
        price: 350,
        status: "Active"
    },
    {
        priceID: 5,
        movieID: 2,
        branchID: 1,
        screenID: 1,
        price: 350,
        status: "Active"
    },
    {
        priceID: 6,
        movieID: 2,
        branchID: 2,
        screenID: 3,
        price: 450,
        status: "Active"
    },
    {
        priceID: 7,
        movieID: 2,
        branchID: 3,
        screenID: 4,
        price: 400,
        status: "Active"
    },
    {
        priceID: 8,
        movieID: 3,
        branchID: 1,
        screenID: 2,
        price: 350,
        status: "Active"
    },
    {
        priceID: 9,
        movieID: 3,
        branchID: 2,
        screenID: 3,
        price: 450,
        status: "Active"
    },
    {
        priceID: 10,
        movieID: 3,
        branchID: 3,
        screenID: 4,
        price: 400,
        status: "Active"
    },
    {
        priceID: 11,
        movieID: 3,
        branchID: 4,
        screenID: 5,
        price: 400,
        status: "Active"
    },
    {
        priceID: 12,
        movieID: 4,
        branchID: 1,
        screenID: 1,
        price: 400,
        status: "Active"
    },
    {
        priceID: 13,
        movieID: 4,
        branchID: 2,
        screenID: 3,
        price: 450,
        status: "Active"
    },
    {
        priceID: 14,
        movieID: 4,
        branchID: 3,
        screenID: 4,
        price: 400,
        status: "Active"
    },
    {
        priceID: 15,
        movieID: 5,
        branchID: 1,
        screenID: 2,
        price: 300,
        status: "Active"
    },
    {
        priceID: 16,
        movieID: 5,
        branchID: 2,
        screenID: 3,
        price: 400,
        status: "Active"
    },
    {
        priceID: 17,
        movieID: 5,
        branchID: 3,
        screenID: 4,
        price: 350,
        status: "Active"
    },
    {
        priceID: 18,
        movieID: 6,
        branchID: 1,
        screenID: 2,
        price: 350,
        status: "Active"
    },
    {
        priceID: 19,
        movieID: 6,
        branchID: 2,
        screenID: 3,
        price: 450,
        status: "Active"
    },
    {
        priceID: 20,
        movieID: 6,
        branchID: 3,
        screenID: 4,
        price: 400,
        status: "Active"
    },
    {
        priceID: 21,
        movieID: 6,
        branchID: 5,
        screenID: 6,
        price: 300,
        status: "Active"
    },
    {
        priceID: 22,
        movieID: 7,
        branchID: 3,
        screenID: 4,
        price: 450,
        status: "Active"
    },
    {
        priceID: 23,
        movieID: 8,
        branchID: 4,
        screenID: 5,
        price: 400,
        status: "Active"
    }
];

const seedTicketPrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await TicketPrice.deleteMany({});

        await TicketPrice.insertMany(ticketPrices);

        console.log(`${ticketPrices.length} ticket prices inserted successfully`);

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Ticket price seeding failed:",
            error.message
        );

        process.exit(1);
    }
};

seedTicketPrices();