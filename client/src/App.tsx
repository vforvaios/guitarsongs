import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Songs from "./components/Songs";
import Song from "./components/Song";
import ScrollToTop from "./components/utils/ScrollToTop";
import ArtistSongs from "./components/ArtistSongs";
import Header from "./components/Header";
import Artists from "./components/Artists";
import AdminHome from "./components/AdminHome";
import AddSong from "./components/AddSong";
import AddArtist from "./components/AddArtist";
import AdminArtists from "./components/AdminArtistx";
import AdminSongs from "./components/AdminSongs";
import AdminEditSong from "./components/AdminEditSong";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <HelmetProvider>
      <SnackbarProvider />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Header />
          <ScrollToTop />
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/categories/:id" element={<Songs />} />
              <Route path="/songs/:id" element={<Song />} />
              <Route path="/artists/:id" element={<ArtistSongs />} />

              <Route path="/artists" element={<Artists />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="addsong" element={<AddSong />} />
                <Route path="artists" element={<AdminArtists />} />
                <Route path="songs" element={<AdminSongs />} />
                <Route path="addartist" element={<AddArtist />} />
                <Route path="songs/:id/edit" element={<AdminEditSong />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
