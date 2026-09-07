import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    role,
    adminOnly,
}) {

    const isCustomerLoggedIn =
        sessionStorage.getItem(
            "isLoggedIn"
        ) === "true";

    const isAdminLoggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        ) === "true";

    if (
        role === "admin" ||
        adminOnly
    ) {

        if (!isAdminLoggedIn) {

            return (
                <Navigate
                    to="/login"
                    replace
                />
            );

        }

        return children;

    }

    if (
        role === "customer"
    ) {

        if (!isCustomerLoggedIn) {

            return (
                <Navigate
                    to="/login"
                    replace
                />
            );

        }

        return children;

    }

    if (
        isCustomerLoggedIn ||
        isAdminLoggedIn
    ) {

        return children;

    }

    return (
        <Navigate
            to="/login"
            replace
        />
    );
}

export default ProtectedRoute;