import mongoose from "mongoose";
import dotenv from "dotenv";
import CinemaBranch from "./models/CinemaBranch.js";

dotenv.config();

const branches = [
    {
        branchID: 1,
        branchName: "MovieBook Dhanmondi",
        location: "Dhanmondi, Dhaka",
        contact: "01700000001",
        status: "Active"
    },
    {
        branchID: 2,
        branchName: "MovieBook Bashundhara",
        location: "Bashundhara, Dhaka",
        contact: "01700000002",
        status: "Active"
    },
    {
        branchID: 3,
        branchName: "MovieBook Uttara",
        location: "Uttara, Dhaka",
        contact: "01700000003",
        status: "Active"
    },
    {
        branchID: 4,
        branchName: "MovieBook Mirpur",
        location: "Mirpur, Dhaka",
        contact: "01794865035",
        status: "Active"
    },
    {
        branchID: 5,
        branchName: "MovieBook Gulshan",
        location: "Gulshan,Dhaka",
        contact: "01794865035",
        status: "Active"
    }
];

const seedBranches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await CinemaBranch.deleteMany({});

        await CinemaBranch.insertMany(branches);

        console.log("Cinema branches inserted successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Cinema branch seeding failed:",
            error.message
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedBranches();