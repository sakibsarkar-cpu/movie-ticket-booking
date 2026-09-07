import { Link } from "react-router-dom";

function Home() {
    return (
        <div>

            {/* Hero Section */}
            <section className="min-h-[600px] bg-base-200 flex items-center">

                <div className="w-[85%] mx-auto grid md:grid-cols-2 gap-10 items-center">

                    <div>

                        <p className="text-primary font-semibold text-lg mb-3">
                            AI-POWERED MOVIE EXPERIENCE
                        </p>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Your Movie.
                            <br />
                            Your Seat.
                            <br />
                            Your Experience.
                        </h1>

                        <p className="mt-6 text-lg text-base-content/70 max-w-xl">
                            Discover movies, get personalized recommendations,
                            choose your perfect seat and book your movie ticket
                            easily.
                        </p>

                        <div className="flex gap-4 mt-8">

                            <Link
                                to="/movies"
                                className="btn btn-primary btn-lg"
                            >
                                Explore Movies
                            </Link>

                            <Link
                                to="/recommendations"
                                className="btn btn-outline btn-lg"
                            >
                                AI Recommendations
                            </Link>

                        </div>

                    </div>

                    <div className="flex justify-center">

                        <div className="w-full max-w-md h-96 rounded-3xl bg-primary/10 flex items-center justify-center">

                            <div className="text-center">

                                <div className="text-8xl mb-5">
                                    🎬
                                </div>

                                <h2 className="text-2xl font-bold">
                                    Welcome to MovieBook
                                </h2>

                                <p className="mt-2 text-base-content/60">
                                    Smart movie booking made simple
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* Main Features */}
            <section className="py-16">

                <div className="w-[85%] mx-auto">

                    <div className="text-center mb-10">

                        <h2 className="text-3xl font-bold">
                            Why Choose MovieBook?
                        </h2>

                        <p className="mt-3 text-base-content/60">
                            Everything you need for a better movie booking
                            experience.
                        </p>

                    </div>


                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">

                                <div className="text-4xl mb-3">
                                    🎥
                                </div>

                                <h3 className="card-title">
                                    Discover Movies
                                </h3>

                                <p>
                                    Browse and search movies and explore
                                    upcoming releases.
                                </p>

                            </div>
                        </div>


                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">

                                <div className="text-4xl mb-3">
                                    🤖
                                </div>

                                <h3 className="card-title">
                                    AI Recommendations
                                </h3>

                                <p>
                                    Get personalized movie recommendations
                                    based on your preferences.
                                </p>

                            </div>
                        </div>


                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">

                                <div className="text-4xl mb-3">
                                    💺
                                </div>

                                <h3 className="card-title">
                                    Smart Seat Selection
                                </h3>

                                <p>
                                    Get AI-powered seat recommendations
                                    before completing your booking.
                                </p>

                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* Booking Steps */}
            <section className="py-16 bg-base-200">

                <div className="w-[85%] mx-auto">

                    <div className="text-center mb-10">

                        <h2 className="text-3xl font-bold">
                            Book Your Movie Ticket
                        </h2>

                    </div>

                    <ul className="steps steps-vertical lg:steps-horizontal w-full">

                        <li className="step step-primary">
                            Choose Movie
                        </li>

                        <li className="step step-primary">
                            Choose Showtime
                        </li>

                        <li className="step">
                            Select Seats
                        </li>

                        <li className="step">
                            Make Payment
                        </li>

                        <li className="step">
                            Get Your Ticket
                        </li>

                    </ul>

                </div>

            </section>

        </div>
    );
}

export default Home;