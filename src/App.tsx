import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import { Toaster } from "./components/ui/toaster";
import { Route, Routes } from "react-router";
import Login from "./pages/login";
import AppLayout from "./components/appLayout";
import Accounts from "./pages/accounts";
import Events from "./pages/events";
import News from "./pages/news";
import AuthContextProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ui/protectedRoute";
import PublicRoute from "./components/ui/publicRoute";
import Home from "./pages/home";
import ErrorPage from "./pages/errorPage";
import AdminLogin from "./pages/adminLogin";
import UserOnbaording from "./pages/userOnbaording";
import AdminConsole from "./pages/adminConsole";
import AdminRoutes from "./components/ui/adminRoutes";
import AdminEvents from "@/features/admin/events";
import ApproveEvent from "./features/admin/approveEvent";
import Feedback from "./features/admin/feedback";
import FlaggedContents from "./features/admin/flaggedContents";
import NewModerator from "./features/admin/newModerator";
import Moderators from "./features/admin/moderators";
import EventDetails from "./components/ui/eventDetails";
import ModeratorDetail from "./components/ui/ModeratorDetail";
import EventHistory from "./pages/eventHistory";
import PeopleFollowing from "./pages/peopleFollowing";
import { PwaInstallDrawer } from "./components/ui/PWAInstallPrompt";
import NewsDetail from "./components/ui/NewsDetail";
import Search from "./pages/search";
import Notification from "./pages/notification";
import { AccountDetails } from "./components/ui/accountDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

/**
 * Root application component that configures app-level providers and defines the public, protected, and admin routes.
 *
 * The component mounts global providers (React Query client, authentication context, PWA install UI) and renders
 * top-level UI (toasts). It also declares the application's route hierarchy, including public, protected, and
 * admin-scoped routes and a fallback error route.
 *
 * @returns The root React element tree for the application.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PwaInstallDrawer />
      <AuthContextProvider>
        <Toaster />
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/onboarding" element={<UserOnbaording />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/account" element={<Accounts />} />
              <Route path="/account/:id" element={<AccountDetails />} />
              <Route path="/event-history" element={<EventHistory />} />
              <Route path="/people-following" element={<PeopleFollowing />} />
              <Route path="/search" element={<Search />} />
              <Route path="/notifications" element={<Notification />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/admin">
                <Route index element={<AdminConsole />} />
                <Route path="view-events" element={<AdminEvents />} />
                <Route path="approve-events" element={<ApproveEvent />} />
                <Route path="approve-events/:id" element={<EventDetails />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="flagged-contents" element={<FlaggedContents />} />
                <Route path="new-moderator" element={<NewModerator />} />
                <Route path="moderators" element={<Moderators />} />
                <Route path="moderators/:id" element={<ModeratorDetail />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;