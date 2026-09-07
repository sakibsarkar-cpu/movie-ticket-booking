import mongoose from "mongoose";
import dotenv from "dotenv";
import Promotion from "./models/Promotion.js";
import Movie from "./models/Movie.js";

dotenv.config();

const seedPromotions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const surongo = await Movie.findOne({
            title: "Surongo"
        });

        const avatar = await Movie.findOne({
            title: "Avatar"
        });

        const promotions = [
            {
                promotionID: 1,
                promotionCode: "WELCOME10",
                description: "10% discount for new customers.",
                discountPercentage: 10,
                movieScope: "all",
                applicableMovieIDs: [],
                applicableDay: "All Days",
                startDate: "2026-09-01",
                endDate: "2026-09-30",
                status: "Active"
            },
            {
                promotionID: 2,
                promotionCode: "MOVIE20",
                description: "20% discount on selected movie bookings.",
                discountPercentage: 20,
                movieScope: "selected",
                applicableMovieIDs: [
                    surongo?.movieID,
                    avatar?.movieID
                ].filter(
                    (movieID) =>
                        movieID !== undefined
                ),
                applicableDay: "All Days",
                startDate: "2026-09-01",
                endDate: "2026-09-15",
                status: "Active"
            },
            {
                promotionID: 3,
                promotionCode: "WEEKEND15",
                description: "15% discount for weekend bookings.",
                discountPercentage: 15,
                movieScope: "all",
                applicableMovieIDs: [],
                applicableDay: "Saturday & Sunday",
                startDate: "2026-09-05",
                endDate: "2026-10-05",
                status: "Active"
            },
            {
                promotionID: 4,
                promotionCode: "FRIDAY20",
                description: "20% discount on Friday bookings.",
                discountPercentage: 20,
                movieScope: "all",
                applicableMovieIDs: [],
                applicableDay: "Friday",
                startDate: "2026-09-01",
                endDate: "2026-09-30",
                status: "Active"
            }
        ];

        await Promotion.deleteMany({});

        await Promotion.insertMany(promotions);

        console.log("4 promotions seeded successfully");

        process.exit();
    } catch (error) {
        console.error(
            "Promotion seeding failed:",
            error.message
        );

        process.exit(1);
    }
};

seedPromotions();