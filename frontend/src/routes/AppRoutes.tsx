import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import Layout from "../components/Layout";

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import ReservationsPage from "../pages/ReservationsPage";
import ResourcesPage from "../pages/ResourcesPage";

import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <RegisterPage />
                        </GuestRoute>
                    }
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/reservations" element={<ReservationsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}