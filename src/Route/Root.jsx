import { createBrowserRouter, Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetails from "../pages/MovieDetails";
import UpcomingMovies from "../pages/UpcomingMovies";
import Booking from "../pages/Booking";
import Payment from "../pages/Payment";
import Ticket from "../pages/Ticket";
import MyBookings from "../pages/MyBookings";
import Profile from "../pages/Profile";
import AIRecommendations from "../pages/AIRecommendations";
import AIChatbot from "../pages/AIChatbot";
import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../admin/pages/AdminDashboard";
import ManageMovies from "../admin/pages/ManageMovies";
import ManageGenres from "../admin/pages/ManageGenres";
import ManageCinemaBranches from "../admin/pages/ManageCinemaBranches";
import ManageScreens from "../admin/pages/ManageScreens";
import ManageSeats from "../admin/pages/ManageSeats";
import ManageShowSchedules from "../admin/pages/ManageShowSchedules";
import ManageTicketPrices from "../admin/pages/ManageTicketPrices";
import ManagePromotions from "../admin/pages/ManagePromotions";
import ManageUsers from "../admin/pages/ManageUsers";
import ManageBookings from "../admin/pages/ManageBookings";
import Reports from "../admin/pages/Reports";

function Layout() {
    return (
        <>
            <Navbar />

            <main>
                <Outlet />
            </main>
        </>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "movies",
                element: <Movies />,
            },
            {
                path: "movies/:movieID",
                element: <MovieDetails />,
            },
            {
                path: "upcoming",
                element: <UpcomingMovies />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "ai-recommendations",
                element: <AIRecommendations />,
            },
            {
                path: "ai-chatbot",
                element: <AIChatbot />,
            },
            {
                path: "booking/:movieID",
                element: (
                    <ProtectedRoute role="customer">
                        <Booking />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payment",
                element: (
                    <ProtectedRoute role="customer">
                        <Payment />
                    </ProtectedRoute>
                ),
            },
            {
                path: "ticket",
                element: (
                    <ProtectedRoute role="customer">
                        <Ticket />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-bookings",
                element: (
                    <ProtectedRoute role="customer">
                        <MyBookings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute role="customer">
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/dashboard",
                element: (
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/movies",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageMovies />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/genres",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageGenres />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/cinema-branches",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageCinemaBranches />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/branches",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageCinemaBranches />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/screens",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageScreens />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/seats",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageSeats />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/schedules",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageShowSchedules />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/ticket-prices",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageTicketPrices />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/promotions",
                element: (
                    <ProtectedRoute role="admin">
                        <ManagePromotions />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/users",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageUsers />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/bookings",
                element: (
                    <ProtectedRoute role="admin">
                        <ManageBookings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/reports",
                element: (
                    <ProtectedRoute role="admin">
                        <Reports />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;