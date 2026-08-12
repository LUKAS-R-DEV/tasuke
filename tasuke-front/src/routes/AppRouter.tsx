import {BrowserRouter,Navigate,Route,Routes} from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout.tsx";
import MainLayout from "@/components/layout/MainLayout.tsx";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import Notifications from "@/pages/notifications/Notifications.tsx";
import Tickets from "@/pages/tickets/Tickets.tsx";
import TicketDetails from "@/pages/tickets/TicketDetails.tsx";
import Users from "@/pages/users/Users.tsx";
import Profile from "@/pages/profile/Profile.tsx";
import Settings from "@/pages/settings/Settings.tsx";
import NotFoundPage from "@/pages/errors/NotFoundPage.tsx";
import ForbidenPage from "@/pages/errors/ForbidenPage.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";

export default function AppRouter (){
    return (
<BrowserRouter>
    <Routes>
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage/>} />
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/tickets" element={<Tickets/>} />
                <Route path="/tickets/:id" element={<TicketDetails/>} />
                <Route path="/notifications" element={<Notifications/>} />
                <Route path="/users" element={<Users/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/settings" element={<Settings/>} />
            </Route>
            <Route path={"/403"} element={<ForbidenPage/>} />
            <Route path={"*"} element={<NotFoundPage/>} />
        </Route>
    </Routes>
</BrowserRouter>
    )
}
