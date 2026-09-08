import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <HelmetProvider>
      <SnackbarProvider />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
