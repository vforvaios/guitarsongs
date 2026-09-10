import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Songs from "./components/Songs";
import AdminDashBoard from "./components/AdminDashBoard";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <HelmetProvider>
      <SnackbarProvider />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route index path="/categories/:id" element={<Songs />} />
              <Route index path="/admin" element={<AdminDashBoard />} />

              {/* <Route path="songs">
                <Route index element={<Songs />} />
                <Route path=":id" element={<Song />} />
              </Route>

              <Route path="favorites" element={<Favorites />} />
              <Route path="setlists" element={<Setlists />} /> */}
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                {/* <Route index element={<AdminDashBoard />} /> */}

                {/* <Route path="songs">
                  <Route index element={<AdminSongs />} />
                  <Route path="new" element={<AdminSongEditor />} />
                  <Route path=":id/edit" element={<AdminSongEditor />} />
                </Route>

                <Route path="artists" element={<AdminArtists />} />
                <Route path="categories" element={<AdminCategories />} /> */}
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
