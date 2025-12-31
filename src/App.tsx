import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Toaster />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<News />} />
              <Route path="/account" element={<Accounts />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
