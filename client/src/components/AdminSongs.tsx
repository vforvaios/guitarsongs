import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Music,
  X,
  Plus,
} from "lucide-react";
import { deleteSong, getAdminSongs } from "@/services/songs";
import { useAuth } from "@/context/AuthContext";

interface AdminSong {
  id: number;
  title: string;
  artist_name: string;
  created_at?: string;
}

const AdminSongs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin_songs"],
    queryFn: getAdminSongs,
    refetchOnWindowFocus: false,
  });

  const songs: AdminSong[] = data?.songs ?? [];

  const filteredSongs = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("el");

    if (!term) return songs;

    return songs.filter(
      (song) =>
        song.title.toLocaleLowerCase("el").includes(term) ||
        song.artist_name?.toLocaleLowerCase("el").includes(term),
    );
  }, [songs, search]);

  const deleteMutation = useMutation({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_songs"] });
      queryClient.invalidateQueries({ queryKey: ["songs_by_category"] });
      queryClient.invalidateQueries({ queryKey: ["artist_songs"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error: Error) => {
      alert(error.message || "Δεν ήταν δυνατή η διαγραφή του τραγουδιού.");
    },
  });

  const handleDelete = (song: AdminSong) => {
    const confirmed = window.confirm(
      `Θέλεις σίγουρα να διαγράψεις το τραγούδι "${song.title}" του καλλιτέχνη "${song.artist_name}";`,
    );

    if (confirmed) {
      deleteMutation.mutate({ id: song.id, token });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-[#c6371a]"
        >
          <ArrowLeft size={20} />
          Πίσω στο Admin
        </button>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#080808]">
              Εύρεση Τραγουδιού
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Αναζήτηση και διαχείριση τραγουδιών.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/addsong")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#c6371a] px-4 py-3 font-semibold text-white transition hover:bg-[#a92e16]"
          >
            <Plus size={18} />
            Νέο Τραγούδι
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση με τίτλο ή καλλιτέχνη..."
            className="w-full bg-transparent text-sm outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Καθαρισμός αναζήτησης"
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <span className="font-semibold text-[#080808]">Τραγούδια</span>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredSongs.length})
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#c6371a]" size={28} />
            </div>
          ) : isError ? (
            <p className="p-8 text-center text-red-600">
              Παρουσιάστηκε σφάλμα κατά τη φόρτωση των τραγουδιών.
            </p>
          ) : filteredSongs.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              Δεν βρέθηκαν τραγούδια.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="w-20 px-5 py-4">ID</th>
                    <th className="px-5 py-4">Τίτλος</th>
                    <th className="px-5 py-4">Καλλιτέχνης</th>
                    <th className="w-32 px-5 py-4 text-center">Ενέργειες</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSongs.map((song) => {
                    const isDeleting =
                      deleteMutation.isPending &&
                      deleteMutation.variables === song.id;

                    return (
                      <tr key={song.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {song.id}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Music
                              size={16}
                              className="shrink-0 text-[#c6371a]"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {song.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {song.artist_name || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/songs/${song.id}/edit`)
                              }
                              disabled={deleteMutation.isPending}
                              title="Επεξεργασία"
                              className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(song)}
                              disabled={deleteMutation.isPending}
                              title="Διαγραφή"
                              className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSongs;
