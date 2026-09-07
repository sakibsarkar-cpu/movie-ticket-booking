import mongoose from "mongoose";
import dotenv from "dotenv";
import Screen from "./models/Screen.js";

dotenv.config();

const screens = [
    {
        screenID: 1,
        screenName: "Screen 1",
        branchID: 1,
        capacity: 50,
        status: "Active"
    },
    {
        screenID: 2,
        screenName: "Screen 2",
        branchID: 1,
        capacity: 48,
        status: "Active"
    },
    {
        screenID: 3,
        screenName: "Screen 1",
        branchID: 2,
        capacity: 48,
        status: "Active"
    },
    {
        screenID: 4,
        screenName: "Screen 3",
        branchID: 3,
        capacity: 48,
        status: "Active"
    },
    {
        screenID: 5,
        screenName: "Screen 3",
        branchID: 4,
        capacity: 48,
        status: "Active"
    },
    {
        screenID: 6,
        screenName: "Screen 4",
        branchID: 5,
        capacity: 48,
        status: "Active"
    }
];

const seedScreens = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Screen.deleteMany({});

        await Screen.insertMany(screens);

        console.log("Screens inserted successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Screen seeding failed:",
            error.message
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedScreens();