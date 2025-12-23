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
      <Toaster />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Login />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="/account" element={<Accounts />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
