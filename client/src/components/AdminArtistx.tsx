import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";
import { deleteArtist, getArtists, updateArtist } from "@/services/artists";

interface Artist {
  id: number;
  name: string;
}

const AdminArtists = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [editingArtistId, setEditingArtistId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const artists: Artist[] = data?.artists ?? [];

  const filteredArtists = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("el");

    if (!term) return artists;

    return artists.filter((artist) =>
      artist.name.toLocaleLowerCase("el").includes(term),
    );
  }, [artists, search]);

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateArtist(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artists_by_category"] });
      setEditingArtistId(null);
      setEditingName("");
    },
    onError: (error: Error) => {
      alert(error.message || "Δεν ήταν δυνατή η ενημέρωση.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artists_by_category"] });
    },
    onError: (error: Error) => {
      alert(error.message || "Δεν ήταν δυνατή η διαγραφή.");
    },
  });

  const handleEdit = (artist: Artist) => {
    setEditingArtistId(artist.id);
    setEditingName(artist.name);
  };

  const handleSave = (id: number) => {
    const name = editingName.trim();

    if (!name) {
      alert("Το όνομα του καλλιτέχνη είναι υποχρεωτικό.");
      return;
    }

    updateMutation.mutate({ id, name });
  };

  const handleDelete = (artist: Artist) => {
    const confirmed = window.confirm(
      `Θέλεις σίγουρα να διαγράψεις τον καλλιτέχνη "${artist.name}";`,
    );

    if (confirmed) {
      deleteMutation.mutate(artist.id);
    }
  };

  const cancelEdit = () => {
    setEditingArtistId(null);
    setEditingName("");
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
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
              Εύρεση Καλλιτέχνη
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Αναζήτηση και διαχείριση καλλιτεχνών.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/artists/new")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#c6371a] px-4 py-3 font-semibold text-white transition hover:bg-[#a92e16]"
          >
            <UserPlus size={18} />
            Νέος Καλλιτέχνης
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <Search size={20} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση καλλιτέχνη..."
            className="w-full bg-transparent text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Καθαρισμός αναζήτησης"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <span className="font-semibold text-[#080808]">Καλλιτέχνες</span>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredArtists.length})
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#c6371a]" size={28} />
            </div>
          ) : isError ? (
            <p className="p-8 text-center text-red-600">
              Παρουσιάστηκε σφάλμα κατά τη φόρτωση των καλλιτεχνών.
            </p>
          ) : filteredArtists.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              Δεν βρέθηκαν καλλιτέχνες.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="w-20 px-5 py-4">ID</th>
                    <th className="px-5 py-4">Όνομα</th>
                    <th className="w-36 px-5 py-4 text-center">Ενέργειες</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredArtists.map((artist) => {
                    const isEditing = editingArtistId === artist.id;
                    const isUpdating =
                      updateMutation.isPending &&
                      updateMutation.variables?.id === artist.id;
                    const isDeleting =
                      deleteMutation.isPending &&
                      deleteMutation.variables === artist.id;

                    return (
                      <tr key={artist.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {artist.id}
                        </td>

                        <td className="px-5 py-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave(artist.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                              maxLength={150}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c6371a]"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-800">
                              {artist.name}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSave(artist.id)}
                                  disabled={isUpdating}
                                  title="Αποθήκευση"
                                  className="rounded-md p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                                >
                                  {isUpdating ? (
                                    <Loader2
                                      size={18}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Check size={18} />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={isUpdating}
                                  title="Ακύρωση"
                                  className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEdit(artist)}
                                  disabled={deleteMutation.isPending}
                                  title="Επεξεργασία"
                                  className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                                >
                                  <Pencil size={18} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(artist)}
                                  disabled={deleteMutation.isPending}
                                  title="Διαγραφή"
                                  className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  {isDeleting ? (
                                    <Loader2
                                      size={18}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </button>
                              </>
                            )}
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

export default AdminArtists;
