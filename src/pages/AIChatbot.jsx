import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaRobot,
    FaPaperPlane,
    FaUser,
    FaFilm,
} from "react-icons/fa";
import { getPoster } from "../utils/posterImages";

function AIChatbot() {

    const chatContainerRef =
        useRef(null);

    const [messages, setMessages] = useState(() => {

        const savedMessages =
            sessionStorage.getItem(
                "moviebook_ai_chat"
            );

        if (savedMessages) {

            try {

                return JSON.parse(
                    savedMessages
                );

            } catch {

                return [
                    {
                        sender: "bot",
                        text: "Hello! I am the MovieBook AI Assistant. You can ask me anything about movies, cinemas, bookings, seats, showtimes, promotions, payments, tickets, or cancellations.",
                    },
                ];

            }

        }

        return [
            {
                sender: "bot",
                text: "Hello! I am the MovieBook AI Assistant. You can ask me anything about movies, cinemas, bookings, seats, showtimes, promotions, payments, tickets, or cancellations.",
            },
        ];

    });

    const [input, setInput] =
        useState("");

    const [movies, setMovies] =
        useState([]);

    const [branches, setBranches] =
        useState([]);

    const [promotions, setPromotions] =
        useState([]);

    const [bookings, setBookings] =
        useState([]);

    useEffect(() => {

        sessionStorage.setItem(
            "moviebook_ai_chat",
            JSON.stringify(messages)
        );

    }, [messages]);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                if (chatContainerRef.current) {

                    chatContainerRef.current.scrollTop =
                        chatContainerRef.current.scrollHeight;

                }

            }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, []);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                if (chatContainerRef.current) {

                    chatContainerRef.current.scrollTop =
                        chatContainerRef.current.scrollHeight;

                }

            }, 100);

        return () => {
            clearTimeout(timer);
        };

    }, [messages]);

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
                        sessionStorage.getItem(
                            "user"
                        )
                    ) || {};

                if (userData.userID) {

                    const bookingResponse =
                        await fetch(
                            `http://localhost:5000/api/bookings/customer/${userData.userID}`
                        );

                    if (
                        bookingResponse.ok
                    ) {

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

    const getMovieTitle = (
        movie
    ) => {

        return (
            movie.title ||
            movie.name ||
            movie.movieTitle ||
            ""
        );

    };

    const getMovieGenre = (
        movie
    ) => {

        return (
            movie.genre ||
            movie.genreName ||
            ""
        );

    };

    const getMovieLanguage = (
        movie
    ) => {

        return (
            movie.language ||
            movie.languageName ||
            ""
        );

    };

    const findMovie = (
        text
    ) => {

        const movieList =
            getMovies();

        return movieList.find(
            (movie) => {

                const title =
                    getMovieTitle(
                        movie
                    ).toLowerCase();

                return (
                    title &&
                    text.includes(title)
                );

            }
        );

    };

    const getMovieList = () => {

        const movieList =
            getMovies();

        if (
            movieList.length === 0
        ) {

            return "You can browse all available movies from the Movies section.";

        }

        const titles =
            movieList
                .map(
                    (movie) =>
                        getMovieTitle(
                            movie
                        )
                )
                .filter(Boolean);

        if (
            titles.length === 0
        ) {

            return "You can browse all available movies from the Movies section.";

        }

        return `Currently available movies include: ${titles.join(", ")}.`;

    };

    const getBranchList = () => {

        const branchList =
            getBranches();

        if (
            branchList.length === 0
        ) {

            return "MovieBook currently has several cinema branches. You can select a branch during the booking process.";

        }

        const names =
            branchList
                .map(
                    (branch) =>
                        branch.branchName ||
                        branch.name ||
                        branch.cinemaName
                )
                .filter(Boolean);

        if (
            names.length === 0
        ) {

            return "You can select a cinema branch during the booking process.";

        }

        return `MovieBook branches include: ${names.join(", ")}.`;

    };

    const getPromotionList = () => {

        const promotionList =
            getPromotions();

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        const activePromotions =
            promotionList.filter(
                (promotion) =>
                    promotion.status ===
                        "Active" &&
                    today >=
                        promotion.startDate &&
                    today <=
                        promotion.endDate
            );

        if (
            activePromotions.length ===
            0
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

    const getGenreRecommendations = (
        text
    ) => {

        const movieList =
            getMovies();

        const availableGenres =
            [
                ...new Set(
                    movieList
                        .flatMap(
                            (movie) => {

                                const genre =
                                    getMovieGenre(
                                        movie
                                    );

                                if (
                                    Array.isArray(
                                        genre
                                    )
                                ) {

                                    return genre;

                                }

                                return String(
                                    genre
                                )
                                    .split(",")
                                    .map(
                                        (
                                            item
                                        ) =>
                                            item.trim()
                                    );

                            }
                        )
                        .filter(Boolean)
                ),
            ];

        const matchedGenre =
            availableGenres.find(
                (genre) => {

                    const genreText =
                        String(
                            genre
                        ).toLowerCase();

                    return (
                        genreText.length >
                            1 &&
                        (
                            text.includes(
                                genreText
                            ) ||
                            text.includes(
                                `${genreText} movies`
                            ) ||
                            text.includes(
                                `${genreText} films`
                            )
                        )
                    );

                }
            );

        if (
            !matchedGenre
        ) {

            return null;

        }

        const matchedMovies =
            movieList.filter(
                (movie) => {

                    const genre =
                        getMovieGenre(
                            movie
                        );

                    if (
                        Array.isArray(
                            genre
                        )
                    ) {

                        return genre.some(
                            (item) =>
                                String(
                                    item
                                )
                                    .toLowerCase()
                                    .includes(
                                        String(
                                            matchedGenre
                                        ).toLowerCase()
                                    )
                        );

                    }

                    return String(
                        genre
                    )
                        .toLowerCase()
                        .includes(
                            String(
                                matchedGenre
                            ).toLowerCase()
                        );

                }
            );

        return {
            genre:
                matchedGenre,
            movies:
                matchedMovies,
        };

    };

    const getLanguageRecommendations =
        (text) => {

            const movieList =
                getMovies();

            const availableLanguages =
                [
                    ...new Set(
                        movieList
                            .map(
                                (movie) =>
                                    getMovieLanguage(
                                        movie
                                    )
                            )
                            .filter(Boolean)
                    ),
                ];

            const matchedLanguage =
                availableLanguages.find(
                    (language) =>
                        text.includes(
                            String(
                                language
                            ).toLowerCase()
                        )
                );

            if (
                !matchedLanguage
            ) {

                return null;

            }

            const matchedMovies =
                movieList.filter(
                    (movie) =>
                        String(
                            getMovieLanguage(
                                movie
                            )
                        ).toLowerCase() ===
                        String(
                            matchedLanguage
                        ).toLowerCase()
                );

            return {
                language:
                    matchedLanguage,
                movies:
                    matchedMovies,
            };

        };

    const getResponse = (
        question
    ) => {

        const text =
            question
                .toLowerCase()
                .trim();

        const movie =
            findMovie(text);

        const genreRecommendation =
            getGenreRecommendations(
                text
            );

        const languageRecommendation =
            getLanguageRecommendations(
                text
            );

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text.includes(
                "good morning"
            ) ||
            text.includes(
                "good afternoon"
            ) ||
            text.includes(
                "good evening"
            )
        ) {

            return {
                text: "Hello! How can I help you with MovieBook today? You can ask about movies, cinemas, bookings, seats, promotions, payments, tickets, or movie recommendations.",
            };

        }

        if (
            genreRecommendation
        ) {

            const recommendedMovies =
                genreRecommendation.movies;

            if (
                recommendedMovies.length ===
                0
            ) {

                return {
                    text: `I could not find any currently available ${genreRecommendation.genre} movies.`,
                };

            }

            return {
                text: `Sure! Here are some currently available ${genreRecommendation.genre} movies. Click on a movie to view its details and continue booking.`,
                movieResults:
                    recommendedMovies,
            };

        }

        if (
            languageRecommendation
        ) {

            const recommendedMovies =
                languageRecommendation.movies;

            if (
                recommendedMovies.length ===
                0
            ) {

                return {
                    text: `I could not find any currently available ${languageRecommendation.language} movies.`,
                };

            }

            return {
                text: `Here are some currently available ${languageRecommendation.language} movies. Click on a movie to view its details and continue booking.`,
                movieResults:
                    recommendedMovies,
            };

        }

        if (
            text.includes(
                "what movies"
            ) ||
            text.includes(
                "which movies"
            ) ||
            text.includes(
                "available movies"
            ) ||
            text.includes(
                "showing movies"
            ) ||
            text.includes(
                "movies showing"
            ) ||
            text.includes(
                "movies available"
            ) ||
            text.includes(
                "list of movies"
            )
        ) {

            return {
                text:
                    getMovieList(),
            };

        }

        if (
            text.includes(
                "upcoming"
            ) ||
            text.includes(
                "coming soon"
            ) ||
            text.includes(
                "future movies"
            )
        ) {

            const movieList =
                getMovies();

            const upcomingMovies =
                movieList.filter(
                    (movie) => {

                        const releaseDate =
                            movie.releaseDate ||
                            movie.release_date;

                        if (
                            !releaseDate
                        ) {

                            return false;

                        }

                        return (
                            releaseDate >
                            new Date()
                                .toISOString()
                                .split(
                                    "T"
                                )[0]
                        );

                    }
                );

            if (
                upcomingMovies.length >
                0
            ) {

                return {
                    text: `Upcoming movies include: ${upcomingMovies
                        .map(
                            (movie) =>
                                getMovieTitle(
                                    movie
                                )
                        )
                        .filter(Boolean)
                        .join(", ")}.`,
                };

            }

            return {
                text: "You can visit the Upcoming Movies section to see movies that will be released soon.",
            };

        }

        if (movie) {

            const title =
                getMovieTitle(
                    movie
                ) ||
                "this movie";

            const description =
                movie.description ||
                movie.shortDescription ||
                movie.short_description;

            const genre =
                getMovieGenre(
                    movie
                );

            const duration =
                movie.duration;

            const language =
                getMovieLanguage(
                    movie
                );

            let response =
                `${title} is available on MovieBook.`;

            if (
                description
            ) {

                response +=
                    ` ${description}`;

            }

            if (
                genre
            ) {

                response +=
                    ` Genre: ${genre}.`;

            }

            if (
                duration
            ) {

                response +=
                    ` Duration: ${duration}.`;

            }

            if (
                language
            ) {

                response +=
                    ` Language: ${language}.`;

            }

            response +=
                " Click the movie below to view its details and start booking.";

            return {
                text:
                    response,
                movieResults: [
                    movie,
                ],
            };

        }

        if (
            text.includes(
                "cinema"
            ) ||
            text.includes(
                "branch"
            ) ||
            text.includes(
                "branches"
            ) ||
            text.includes(
                "theater"
            ) ||
            text.includes(
                "theatre"
            ) ||
            text.includes(
                "location"
            )
        ) {

            return {
                text:
                    getBranchList(),
            };

        }

        if (
            text.includes(
                "where"
            ) &&
            (
                text.includes(
                    "cinema"
                ) ||
                text.includes(
                    "moviebook"
                )
            )
        ) {

            return {
                text:
                    getBranchList(),
            };

        }

        if (
            text.includes(
                "my booking"
            ) ||
            text.includes(
                "my bookings"
            ) ||
            text.includes(
                "booking history"
            ) ||
            text.includes(
                "past booking"
            ) ||
            text.includes(
                "how many bookings"
            ) ||
            text.includes(
                "how many booking"
            ) ||
            text.includes(
                "number of bookings"
            )
        ) {

            const bookingList =
                getBookings();

            if (
                bookingList.length >
                0
            ) {

                return {
                    text: `You currently have ${bookingList.length} booking record${bookingList.length > 1 ? "s" : ""}. You can open My Bookings from the navigation menu to view them.`,
                };

            }

            return {
                text: "You currently have no booking records. You can make a booking from the Movies section.",
            };

        }

        if (
            text.includes(
                "book"
            ) ||
            text.includes(
                "booking"
            ) ||
            text.includes(
                "reserve"
            ) ||
            text.includes(
                "reservation"
            )
        ) {

            return {
                text: "To book a movie, go to Movies, select your movie, choose a cinema branch, date, showtime, and available seats. Then proceed to payment and confirm your booking.",
            };

        }

        if (
            text.includes(
                "how many seats"
            ) ||
            text.includes(
                "multiple seats"
            ) ||
            text.includes(
                "more than one seat"
            ) ||
            text.includes(
                "number of seats"
            )
        ) {

            return {
                text: "You can select multiple available seats during the seat selection step. The total amount will automatically update according to the number of selected seats.",
            };

        }

        if (
            text.includes(
                "seat"
            ) ||
            text.includes(
                "available seat"
            ) ||
            text.includes(
                "choose seat"
            ) ||
            text.includes(
                "select seat"
            )
        ) {

            return {
                text: "During booking, available seats can be selected. Occupied seats cannot be selected. You can also use Smart Seat Recommendation to get suggested seats.",
            };

        }

        if (
            text.includes(
                "smart seat"
            ) ||
            text.includes(
                "seat recommendation"
            ) ||
            text.includes(
                "recommend seats"
            )
        ) {

            return {
                text: "Smart Seat Recommendation suggests suitable available seats during the seat selection process. You can accept the recommendation or select seats manually.",
            };

        }

        if (
            text.includes(
                "showtime"
            ) ||
            text.includes(
                "show time"
            ) ||
            text.includes(
                "time"
            ) ||
            text.includes(
                "schedule"
            )
        ) {

            return {
                text: "After selecting a movie and cinema branch, you can choose an available date and showtime. The available showtimes are displayed during the booking process.",
            };

        }

        if (
            text.includes(
                "promotion"
            ) ||
            text.includes(
                "promotions"
            ) ||
            text.includes(
                "promo"
            ) ||
            text.includes(
                "discount"
            ) ||
            text.includes(
                "coupon"
            ) ||
            text.includes(
                "offer"
            )
        ) {

            return {
                text:
                    getPromotionList(),
            };

        }

        if (
            text.includes(
                "promo code"
            ) ||
            text.includes(
                "promotion code"
            ) ||
            text.includes(
                "discount code"
            )
        ) {

            return {
                text: "You can click the Promotion Code field on the Payment page to see available promotion codes. Select a promotion and click Apply. The discount will then be deducted from your subtotal.",
            };

        }

        if (
            text.includes(
                "friday"
            ) ||
            text.includes(
                "weekend"
            )
        ) {

            const promotionList =
                getPromotions();

            const matchingPromotions =
                promotionList.filter(
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
                            code.includes(
                                "friday"
                            ) ||
                            code.includes(
                                "weekend"
                            ) ||
                            description.includes(
                                "friday"
                            ) ||
                            description.includes(
                                "weekend"
                            )
                        );

                    }
                );

            if (
                matchingPromotions.length >
                0
            ) {

                return {
                    text:
                        matchingPromotions
                            .map(
                                (
                                    promotion
                                ) =>
                                    `${promotion.promotionCode} gives ${promotion.discountPercentage}% discount. ${promotion.description || ""}`
                            )
                            .join(" "),
                };

            }

            return {
                text: "Friday and weekend promotions depend on the active promotions configured by the administrator.",
            };

        }

        if (
            text.includes(
                "payment"
            ) ||
            text.includes(
                "pay"
            ) ||
            text.includes(
                "card"
            ) ||
            text.includes(
                "cash"
            ) ||
            text.includes(
                "mobile banking"
            )
        ) {

            return {
                text: "MovieBook currently provides Card, Mobile, and Cash payment options. Select your preferred method on the Payment page and complete the required information.",
            };

        }

        if (
            text.includes(
                "payment failed"
            ) ||
            text.includes(
                "payment failure"
            ) ||
            text.includes(
                "cannot pay"
            ) ||
            text.includes(
                "payment error"
            )
        ) {

            return {
                text: "If your payment fails, check the payment information and try again. Your booking should only be confirmed after a successful payment.",
            };

        }

        if (
            text.includes(
                "ticket"
            ) ||
            text.includes(
                "movie ticket"
            )
        ) {

            return {
                text: "After successful payment, MovieBook generates your movie ticket automatically. You can view the ticket and use the Print / Save Ticket option.",
            };

        }

        if (
            text.includes(
                "download ticket"
            ) ||
            text.includes(
                "save ticket"
            ) ||
            text.includes(
                "print ticket"
            )
        ) {

            return {
                text: "After your booking is confirmed, open your ticket and use the Print / Save Ticket option to save or print your ticket.",
            };

        }

        if (
            text.includes(
                "cancel"
            ) ||
            text.includes(
                "cancellation"
            )
        ) {

            return {
                text: "You can cancel a confirmed booking from My Bookings. Open the booking, select Cancel, and confirm the cancellation. The booked seats will then become available again.",
            };

        }

        if (
            text.includes(
                "profile"
            ) ||
            text.includes(
                "account"
            ) ||
            text.includes(
                "change my name"
            ) ||
            text.includes(
                "change my phone"
            ) ||
            text.includes(
                "update my information"
            )
        ) {

            return {
                text: "You can open My Profile from the customer menu to view and update your account information.",
            };

        }

        if (
            text.includes(
                "recommend"
            ) ||
            text.includes(
                "suggest a movie"
            ) ||
            text.includes(
                "suggest me"
            )
        ) {

            return {
                text: "Tell me what type of movie you like, such as action, comedy, horror, drama, romance, or another genre, and I will show you currently available movies.",
            };

        }

        if (
            text.includes(
                "how"
            ) &&
            (
                text.includes(
                    "work"
                ) ||
                text.includes(
                    "use"
                )
            )
        ) {

            return {
                text: "MovieBook allows you to browse movies, select a cinema branch, choose a showtime and seats, apply promotions, make payment, and receive your ticket.",
            };

        }

        if (
            text.includes(
                "hello"
            ) ||
            text.includes(
                "help"
            ) ||
            text.includes(
                "can you"
            )
        ) {

            return {
                text: "I can help with movies, cinema branches, showtimes, seats, bookings, promotions, payments, tickets, cancellations, profiles, and movie recommendations.",
            };

        }

        return {
            text: "I can help with MovieBook-related questions. You can ask me things like: What movies are showing? I like action movies, can you suggest some? What branches do you have? How do I book a ticket? What promotions are active? How do I cancel a booking?",
        };

    };

    const handleSubmit = (
        event
    ) => {

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

        const response =
            getResponse(
                question
            );

        const botMessage = {
            sender: "bot",
            text: response.text,
            movieResults:
                response.movieResults ||
                [],
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

        setInput(
            question
        );

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

                        <div
                            ref={
                                chatContainerRef
                            }
                            className="h-[450px] overflow-y-auto p-6"
                        >

                            <div className="space-y-5">

                                {messages.map(
                                    (
                                        message,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.sender ===
                                                "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >

                                            <div
                                                className={`flex items-start gap-3 max-w-[90%] ${
                                                    message.sender ===
                                                    "user"
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }`}
                                            >

                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        message.sender ===
                                                        "user"
                                                            ? "bg-primary text-primary-content"
                                                            : "bg-primary/10 text-primary"
                                                    }`}
                                                >

                                                    {message.sender ===
                                                    "user" ? (
                                                        <FaUser />
                                                    ) : (
                                                        <FaRobot />
                                                    )}

                                                </div>

                                                <div
                                                    className={`p-4 rounded-2xl ${
                                                        message.sender ===
                                                        "user"
                                                            ? "bg-primary text-primary-content rounded-tr-none"
                                                            : "bg-base-200 rounded-tl-none"
                                                    }`}
                                                >

                                                    <p className="text-sm leading-relaxed">
                                                        {
                                                            message.text
                                                        }
                                                    </p>

                                                    {message.movieResults &&
                                                        message
                                                            .movieResults
                                                            .length >
                                                            0 && (

                                                            <div className="mt-4 space-y-3">

                                                                {message.movieResults.map(
                                                                    (
                                                                        movie
                                                                    ) => {

                                                                        const title =
                                                                            getMovieTitle(
                                                                                movie
                                                                            );

                                                                        const genre =
                                                                            getMovieGenre(
                                                                                movie
                                                                            );

                                                                        const language =
                                                                            getMovieLanguage(
                                                                                movie
                                                                            );

                                                                        const image =
                                                                            getPoster(
                                                                                movie.image
                                                                            );

                                                                        return (
                                                                            <Link
                                                                                key={
                                                                                    movie.movieID
                                                                                }
                                                                                to={`/movies/${movie.movieID}`}
                                                                                className="block bg-base-100 text-base-content border border-base-300 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition"
                                                                            >

                                                                                <div className="flex">

                                                                                    {image ? (
                                                                                        <img
                                                                                            src={
                                                                                                image
                                                                                            }
                                                                                            alt={
                                                                                                title
                                                                                            }
                                                                                            className="w-20 h-28 object-cover"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-20 h-28 bg-primary/10 flex items-center justify-center flex-shrink-0">

                                                                                            <FaFilm className="text-primary text-2xl" />

                                                                                        </div>
                                                                                    )}

                                                                                    <div className="p-3 flex-1">

                                                                                        <h3 className="font-bold text-base">
                                                                                            {
                                                                                                title
                                                                                            }
                                                                                        </h3>

                                                                                        <div className="flex flex-wrap gap-2 mt-2">

                                                                                            {genre && (
                                                                                                <span className="badge badge-primary badge-sm">
                                                                                                    {
                                                                                                        genre
                                                                                                    }
                                                                                                </span>
                                                                                            )}

                                                                                            {language && (
                                                                                                <span className="badge badge-outline badge-sm">
                                                                                                    {
                                                                                                        language
                                                                                                    }
                                                                                                </span>
                                                                                            )}

                                                                                        </div>

                                                                                        <p className="text-xs text-primary font-semibold mt-3">
                                                                                            View Movie →
                                                                                        </p>

                                                                                    </div>

                                                                                </div>

                                                                            </Link>
                                                                        );

                                                                    }
                                                                )}

                                                            </div>

                                                        )}

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
                                    value={
                                        input
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setInput(
                                            event
                                                .target
                                                .value
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
                                            "I like action movies, can you suggest some?"
                                        )
                                    }
                                    className="btn btn-outline btn-sm"
                                >
                                    Action Movies
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

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AIChatbot;