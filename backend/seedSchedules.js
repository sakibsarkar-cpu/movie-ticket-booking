import mongoose from "mongoose";
import dotenv from "dotenv";
import ShowSchedule from "./models/ShowSchedule.js";

dotenv.config();

const schedules = [
    {
        scheduleID: 1,
        movieID: 1,
        branchID: 1,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "10:00 AM",
        endTime: "12:28 PM",
        ticketPrice: 350,
        screenID: 1,
        status: "Active"
    },
    {
        scheduleID: 2,
        movieID: 1,
        branchID: 1,
        screenName: "Screen 2",
        showDate: "2026-09-01",
        startTime: "3:00 PM",
        endTime: "5:28 PM",
        ticketPrice: 400,
        screenID: 2,
        status: "Active"
    },
    {
        scheduleID: 3,
        movieID: 1,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "6:30 PM",
        endTime: "8:58 PM",
        ticketPrice: 450,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 4,
        movieID: 1,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "2:00 PM",
        endTime: "4:28 PM",
        ticketPrice: 350,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 5,
        movieID: 2,
        branchID: 1,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "11:00 AM",
        endTime: "1:49 PM",
        ticketPrice: 350,
        screenID: 1,
        status: "Active"
    },
    {
        scheduleID: 6,
        movieID: 2,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "4:00 PM",
        endTime: "6:49 PM",
        ticketPrice: 450,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 7,
        movieID: 2,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "7:00 PM",
        endTime: "9:49 PM",
        ticketPrice: 400,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 8,
        movieID: 3,
        branchID: 1,
        screenName: "Screen 2",
        showDate: "2026-09-01",
        startTime: "12:00 PM",
        endTime: "2:32 PM",
        ticketPrice: 350,
        screenID: 2,
        status: "Active"
    },
    {
        scheduleID: 9,
        movieID: 3,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "5:00 PM",
        endTime: "7:32 PM",
        ticketPrice: 450,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 10,
        movieID: 3,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "8:00 PM",
        endTime: "10:32 PM",
        ticketPrice: 400,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 11,
        movieID: 4,
        branchID: 1,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "10:30 AM",
        endTime: "1:21 PM",
        ticketPrice: 400,
        screenID: 1,
        status: "Active"
    },
    {
        scheduleID: 12,
        movieID: 4,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "3:30 PM",
        endTime: "6:21 PM",
        ticketPrice: 450,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 13,
        movieID: 4,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "7:30 PM",
        endTime: "10:21 PM",
        ticketPrice: 400,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 14,
        movieID: 5,
        branchID: 1,
        screenName: "Screen 2",
        showDate: "2026-09-01",
        startTime: "11:30 AM",
        endTime: "1:42 PM",
        ticketPrice: 300,
        screenID: 2,
        status: "Active"
    },
    {
        scheduleID: 15,
        movieID: 5,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "4:30 PM",
        endTime: "6:42 PM",
        ticketPrice: 400,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 16,
        movieID: 5,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "8:30 PM",
        endTime: "10:42 PM",
        ticketPrice: 350,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 17,
        movieID: 6,
        branchID: 1,
        screenName: "Screen 2",
        showDate: "2026-09-01",
        startTime: "12:30 PM",
        endTime: "2:46 PM",
        ticketPrice: 350,
        screenID: 2,
        status: "Active"
    },
    {
        scheduleID: 18,
        movieID: 6,
        branchID: 2,
        screenName: "Screen 1",
        showDate: "2026-09-01",
        startTime: "5:30 PM",
        endTime: "7:46 PM",
        ticketPrice: 450,
        screenID: 3,
        status: "Active"
    },
    {
        scheduleID: 19,
        movieID: 6,
        branchID: 3,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "9:00 PM",
        endTime: "11:16 PM",
        ticketPrice: 400,
        screenID: 4,
        status: "Active"
    },
    {
        scheduleID: 20,
        movieID: 7,
        branchID: 3,
        screenID: 4,
        showDate: "2026-09-10",
        startTime: "6:00 PM",
        endTime: "8:42 PM",
        ticketPrice: 450,
        status: "Active",
        screenName: "Screen 3"
    },
    {
        scheduleID: 21,
        movieID: 5,
        branchID: 3,
        screenID: 4,
        screenName: "Screen 3",
        showDate: "2026-09-02",
        startTime: "15:50",
        endTime: "17:48",
        ticketPrice: 350,
        status: "Active"
    },
    {
        scheduleID: 22,
        movieID: 3,
        branchID: 4,
        screenID: 5,
        screenName: "Screen 3",
        showDate: "2026-09-03",
        startTime: "11:01",
        endTime: "13:01",
        ticketPrice: 400,
        status: "Active"
    },
    {
        scheduleID: 23,
        movieID: 6,
        movieTitle: "The Matrix",
        branchID: 5,
        branchName: "MovieBook Gulshan",
        location: "Gulshan,Dhaka",
        screenID: 6,
        screenName: "Screen 4",
        showDate: "2026-09-04",
        startTime: "20:09",
        endTime: "22:09",
        ticketPrice: 300,
        status: "Active"
    },
    {
        scheduleID: 24,
        movieID: 8,
        movieTitle: "Surongo",
        branchID: 4,
        branchName: "MovieBook Mirpur",
        location: "Mirpur, Dhaka",
        screenID: 5,
        screenName: "Screen 3",
        showDate: "2026-09-05",
        startTime: "11:00",
        endTime: "13:30",
        ticketPrice: 400,
        status: "Active"
    }
];

const seedSchedules = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await ShowSchedule.deleteMany({});

        await ShowSchedule.insertMany(schedules);

        console.log(`${schedules.length} schedules inserted successfully`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Schedule seeding failed:", error.message);
        process.exit(1);
    }
};

seedSchedules();