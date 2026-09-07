import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaRobot,
    FaPaperPlane,
    FaUser,
} from "react-icons/fa";

function AIChatbot() {

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! I am the MovieBook AI Assistant. You can ask me anything about movies, cinemas, bookings, seats, showtimes, promotions, payments, tickets, or cancellations.",
        },
    ]);

    const [input, setInput] = useState("");

    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    movieResponse,
                    branchResponse,
                    promotionResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/movies/active"
                    ),
                    fetch(
                        "http://localhost:5000/api/branches"
                    ),
                    fetch(
                        "http://localhost:5000/api/promotions"
                    ),
                ]);

                const [
                    movieData,
                    branchData,
                    promotionData,
                ] = await Promise.all([
                    movieResponse.json(),
                    branchResponse.json(),
                    promotionResponse.json(),
                ]);

                if (movieResponse.ok) {
                    setMovies(
                        Array.isArray(movieData)
                            ? movieData
                            : []
                    );
                }

                if (branchResponse.ok) {
                    setBranches(
                        Array.isArray(branchData)
                            ? branchData
                            : []
                    );
                }

                if (promotionResponse.ok) {
                    setPromotions(
                        Array.isArray(promotionData)
                            ? promotionData
                            : []
                    );
                }

                const userData =
                    JSON.parse(
                        sessionStorage.getItem("user")
                    ) || {};

                if (userData.userID) {
                    const bookingResponse =
                        await fetch(
                            `http://localhost:5000/api/bookings/customer/${userData.userID}`
                        );

                    if (bookingResponse.ok) {
                        const bookingData =
                            await bookingResponse.json();

                        setBookings(
                            Array.isArray(
                                bookingData
                            )
                                ? bookingData
                                : []
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load AI Assistant data:",
                    error
                );
            }
        };

        loadData();
    }, []);

    const getMovies = () => {
        return movies;
    };

    const getBranches = () => {
        return branches;
    };

    const getPromotions = () => {
        return promotions;
    };

    const getBookings = () => {
        return bookings;
    };

    const findMovie = (text) => {
        const movies = getMovies();

        return movies.find((movie) => {
            const title =
                String(
                    movie.title ||
                    movie.name ||
                    movie.movieTitle ||
                    ""
                ).toLowerCase();

            return (
                title &&
                text.includes(title)
            );
        });
    };

    const getMovieList = () => {
        const movies = getMovies();

        if (movies.length === 0) {
            return "You can browse all available movies from the Movies section.";
        }

        const titles = movies
            .map(
                (movie) =>
                    movie.title ||
                    movie.name ||
                    movie.movieTitle
            )
            .filter(Boolean);

        if (titles.length === 0) {
            return "You can browse all available movies from the Movies section.";
        }

        return `Currently available movies include: ${titles.join(", ")}.`;
    };

    const getBranchList = () => {
        const branches = getBranches();

        if (branches.length === 0) {
            return "MovieBook currently has several cinema branches. You can select a branch during the booking process.";
        }

        const names = branches
            .map(
                (branch) =>
                    branch.branchName ||
                    branch.name ||
                    branch.cinemaName
            )
            .filter(Boolean);

        if (names.length === 0) {
            return "You can select a cinema branch during the booking process.";
        }

        return `MovieBook branches include: ${names.join(", ")}.`;
    };

    const getPromotionList = () => {
        const promotions = getPromotions();

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        const activePromotions =
            promotions.filter(
                (promotion) =>
                    promotion.status === "Active" &&
                    today >= promotion.startDate &&
                    today <= promotion.endDate
            );

        if (
            activePromotions.length === 0
        ) {
            return "There are currently no active promotions available. You can check the promotion code section during payment.";
        }

        const promotionText =
            activePromotions.map(
                (promotion) =>
                    `${promotion.promotionCode} (${promotion.discountPercentage}% off)`
            );

        return `Currently available promotions: ${promotionText.join(", ")}. You can apply one during payment.`;
    };

    const getResponse = (question) => {
        const text =
            question
                .toLowerCase()
                .trim();

        const movie =
            findMovie(text);

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text.includes("good morning") ||
            text.includes("good afternoon") ||
            text.includes("good evening")
        ) {
            return "Hello! How can I help you with MovieBook today? You can ask about movies, cinemas, bookings, seats, promotions, payments, tickets, or cancellations.";
        }

        if (
            text.includes("what movies") ||
            text.includes("which movies") ||
            text.includes("available movies") ||
            text.includes("showing movies") ||
            text.includes("movies showing") ||
            text.includes("movies available") ||
            text.includes("list of movies")
        ) {
            return getMovieList();
        }

        if (
            text.includes("upcoming") ||
            text.includes("coming soon") ||
            text.includes("future movies")
        ) {
            const movies =
                getMovies();

            const upcomingMovies =
                movies.filter((movie) => {
                    const releaseDate =
                        movie.releaseDate ||
                        movie.release_date;

                    if (!releaseDate) {
                        return false;
                    }

                    return (
                        releaseDate >
                        new Date()
                            .toISOString()
                            .split("T")[0]
                    );
                });

            if (
                upcomingMovies.length > 0
            ) {
                const names =
                    upcomingMovies
                        .map(
                            (movie) =>
                                movie.title ||
                                movie.name ||
                                movie.movieTitle
                        )
                        .filter(Boolean);

                return `Upcoming movies include: ${names.join(", ")}.`;
            }

            return "You can visit the Upcoming Movies section to see movies that will be released soon.";
        }

        if (movie) {
            const title =
                movie.title ||
                movie.name ||
                movie.movieTitle ||
                "this movie";

            const description =
                movie.description ||
                movie.shortDescription ||
                movie.short_description;

            const genre =
                movie.genre ||
                movie.genreName;

            const duration =
                movie.duration;

            const language =
                movie.language;

            let response =
                `${title} is available on MovieBook.`;

            if (description) {
                response += ` ${description}`;
            }

            if (genre) {
                response += ` Genre: ${genre}.`;
            }

            if (duration) {
                response += ` Duration: ${duration}.`;
            }

            if (language) {
                response += ` Language: ${language}.`;
            }

            response +=
                " You can open the movie details page to see more information and start booking.";

            return response;
        }

        if (
            text.includes("cinema") ||
            text.includes("branch") ||
            text.includes("branches") ||
            text.includes("theater") ||
            text.includes("theatre") ||
            text.includes("location")
        ) {
            return getBranchList();
        }

        if (
            text.includes("where") &&
            (
                text.includes("cinema") ||
                text.includes("moviebook")
            )
        ) {
            return getBranchList();
        }

        if (
            text.includes("my booking") ||
            text.includes("my bookings") ||
            text.includes("booking history") ||
            text.includes("past booking") ||
            text.includes("how many bookings") ||
            text.includes("how many booking") ||
            text.includes("number of bookings")
        ) {
            const bookings =
                getBookings();

            if (
                bookings.length > 0
            ) {
                return `You currently have ${bookings.length} booking record${bookings.length > 1 ? "s" : ""}. You can open My Bookings from the navigation menu to view them.`;
            }

            return "You currently have no booking records. You can make a booking from the Movies section.";
        }

        if (
            text.includes("book") ||
            text.includes("booking") ||
            text.includes("reserve") ||
            text.includes("reservation")
        ) {
            return "To book a movie, go to Movies, select your movie, choose a cinema branch, date, showtime, and available seats. Then proceed to payment and confirm your booking.";
        }

        if (
            text.includes("how many seats") ||
            text.includes("multiple seats") ||
            text.includes("more than one seat") ||
            text.includes("number of seats")
        ) {
            return "You can select multiple available seats during the seat selection step. The total amount will automatically update according to the number of selected seats.";
        }

        if (
            text.includes("seat") ||
            text.includes("available seat") ||
            text.includes("choose seat") ||
            text.includes("select seat")
        ) {
            return "During booking, available seats can be selected. Occupied seats cannot be selected. You can also use Smart Seat Recommendation to get suggested seats.";
        }

        if (
            text.includes("smart seat") ||
            text.includes("seat recommendation") ||
            text.includes("recommend seats")
        ) {
            return "Smart Seat Recommendation suggests suitable available seats during the seat selection process. You can accept the recommendation or select seats manually.";
        }

        if (
            text.includes("showtime") ||
            text.includes("show time") ||
            text.includes("time") ||
            text.includes("schedule")
        ) {
            return "After selecting a movie and cinema branch, you can choose an available date and showtime. The available showtimes are displayed during the booking process.";
        }

        if (
            text.includes("promotion") ||
            text.includes("promotions") ||
            text.includes("promo") ||
            text.includes("discount") ||
            text.includes("coupon") ||
            text.includes("offer")
        ) {
            return getPromotionList();
        }

        if (
            text.includes("promo code") ||
            text.includes("promotion code") ||
            text.includes("discount code")
        ) {
            return "You can click the Promotion Code field on the Payment page to see available promotion codes. Select a promotion and click Apply. The discount will then be deducted from your subtotal.";
        }

        if (
            text.includes("friday") ||
            text.includes("weekend")
        ) {
            const promotions =
                getPromotions();

            const matchingPromotions =
                promotions.filter(
                    (promotion) => {
                        const code =
                            String(
                                promotion.promotionCode ||
                                ""
                            ).toLowerCase();

                        const description =
                            String(
                                promotion.description ||
                                ""
                            ).toLowerCase();

                        return (
                            code.includes("friday") ||
                            code.includes("weekend") ||
                            description.includes("friday") ||
                            description.includes("weekend")
                        );
                    }
                );

            if (
                matchingPromotions.length > 0
            ) {
                return matchingPromotions
                    .map(
                        (promotion) =>
                            `${promotion.promotionCode} gives ${promotion.discountPercentage}% discount. ${promotion.description || ""}`
                    )
                    .join(" ");
            }

            return "Friday and weekend promotions depend on the active promotions configured by the administrator.";
        }

        if (
            text.includes("payment") ||
            text.includes("pay") ||
            text.includes("card") ||
            text.includes("cash") ||
            text.includes("mobile banking")
        ) {
            return "MovieBook currently provides Card, Mobile, and Cash payment options. Select your preferred method on the Payment page and complete the required information.";
        }

        if (
            text.includes("payment failed") ||
            text.includes("payment failure") ||
            text.includes("cannot pay") ||
            text.includes("payment error")
        ) {
            return "If your payment fails, check the payment information and try again. Your booking should only be confirmed after a successful payment.";
        }

        if (
            text.includes("ticket") ||
            text.includes("movie ticket")
        ) {
            return "After successful payment, MovieBook generates your movie ticket automatically. You can view the ticket and use the Print / Save Ticket option.";
        }

        if (
            text.includes("download ticket") ||
            text.includes("save ticket") ||
            text.includes("print ticket")
        ) {
            return "After your booking is confirmed, open your ticket and use the Print / Save Ticket option to save or print your ticket.";
        }

        if (
            text.includes("cancel") ||
            text.includes("cancellation")
        ) {
            return "You can cancel a confirmed booking from My Bookings. Open the booking, select Cancel, and confirm the cancellation. The booked seats will then become available again.";
        }

        if (
            text.includes("profile") ||
            text.includes("account") ||
            text.includes("change my name") ||
            text.includes("change my phone") ||
            text.includes("update my information")
        ) {
            return "You can open My Profile from the customer menu to view and update your account information.";
        }

        if (
            text.includes("recommend") ||
            text.includes("suggest a movie") ||
            text.includes("suggest me")
        ) {
            return "For personalized movie recommendations, visit the AI Recommendations page. You can also tell me what type of movie you are looking for and I can guide you.";
        }

        if (
            text.includes("genre") ||
            text.includes("action movie") ||
            text.includes("comedy movie") ||
            text.includes("horror movie") ||
            text.includes("romantic movie") ||
            text.includes("thriller movie")
        ) {
            return "You can browse movies and use their genre information to find the type of movie you prefer. For personalized suggestions, visit AI Recommendations.";
        }

        if (
            text.includes("how") &&
            (
                text.includes("work") ||
                text.includes("use")
            )
        ) {
            return "MovieBook allows you to browse movies, select a cinema branch, choose a showtime and seats, apply promotions, make payment, and receive your ticket.";
        }

        if (
            text.includes("hello") ||
            text.includes("help") ||
            text.includes("can you")
        ) {
            return "I can help you with movies, cinema branches, showtimes, seats, bookings, promotions, payments, tickets, cancellations, profiles, and movie recommendations.";
        }

        return "I can help with MovieBook-related questions. You can ask me things like: What movies are showing? What branches do you have? How do I book a ticket? Which seats are available? What promotions are active? How do I cancel a booking? How do I get my ticket?";
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const question =
            input.trim();

        if (!question) {
            return;
        }

        const userMessage = {
            sender: "user",
            text: question,
        };

        const botMessage = {
            sender: "bot",
            text: getResponse(question),
        };

        setMessages(
            (previousMessages) => [
                ...previousMessages,
                userMessage,
                botMessage,
            ]
        );

        setInput("");
    };

    const handleSuggestion = (
        question
    ) => {
        setInput(question);
    };

    return (
        <div className="min-h-screen bg-base-200 py-10">

            <div className="w-[90%] max-w-4xl mx-auto">

                <Link
                    to="/"
                    className="btn btn-ghost btn-sm mb-6"
                >
                    <FaArrowLeft />
                    Back to Home
                </Link>

                <div className="text-center mb-8">

                    <div className="flex justify-center">

                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">

                            <FaRobot className="text-primary text-3xl" />

                        </div>

                    </div>

                    <p className="text-primary font-semibold text-sm mt-4">
                        AI ASSISTANT
                    </p>

                    <h1 className="text-4xl font-bold mt-1">
                        MovieBook AI Assistant
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Ask questions and get help with your movie booking.
                    </p>

                </div>

                <div className="card bg-base-100 shadow-xl">

                    <div className="card-body p-0">

                        <div className="bg-primary text-primary-content p-5 rounded-t-2xl">

                            <div className="flex items-center gap-3">

                                <FaRobot className="text-2xl" />

                                <div>

                                    <h2 className="font-bold text-lg">
                                        MovieBook Assistant
                                    </h2>

                                    <p className="text-sm opacity-80">
                                        Online and ready to help
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="h-[450px] overflow-y-auto p-6">

                            <div className="space-y-5">

                                {messages.map(
                                    (message, index) => (

                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >

                                            <div
                                                className={`flex items-start gap-3 max-w-[80%] ${
                                                    message.sender === "user"
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }`}
                                            >

                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        message.sender === "user"
                                                            ? "bg-primary text-primary-content"
                                                            : "bg-primary/10 text-primary"
                                                    }`}
                                                >

                                                    {message.sender === "user" ? (
                                                        <FaUser />
                                                    ) : (
                                                        <FaRobot />
                                                    )}

                                                </div>

                                                <div
                                                    className={`p-4 rounded-2xl ${
                                                        message.sender === "user"
                                                            ? "bg-primary text-primary-content rounded-tr-none"
                                                            : "bg-base-200 rounded-tl-none"
                                                    }`}
                                                >

                                                    <p className="text-sm leading-relaxed">
                                                        {message.text}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="border-t border-base-300 p-4">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="flex gap-3"
                            >

                                <input
                                    type="text"
                                    value={input}
                                    onChange={
                                        (event) =>
                                            setInput(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Ask anything about MovieBook..."
                                    className="input input-bordered flex-1"
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >

                                    <FaPaperPlane />
                                    Send

                                </button>

                            </form>

                            <div className="flex flex-wrap gap-2 mt-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSuggestion(
                                            "What movies are showing now?"
                                        )
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    Movies
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSuggestion(
                                            "What cinema branches do you have?"
                                        )
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    Cinemas
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSuggestion(
                                            "What promotions are available?"
                                        )
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    Promotions
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSuggestion(
                                            "How can I book a movie?"
                                        )
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    Booking Help
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AIChatbot;