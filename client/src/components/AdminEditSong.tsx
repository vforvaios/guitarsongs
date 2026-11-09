import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Editor from "@hosanna/chordpro/editor";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { getCategories } from "@/services/categories";
import { getArtists } from "@/services/artists";
import { getSongById, updateSong } from "@/services/songs";

interface SongFormData {
  title: string;
  artist_id: string;
  category_id: string;
  content: string;
}

const AdminEditSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const songId = Number(id);

  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    artist_id: "",
    category_id: "",
    content: "",
  });

  const {
    data: songData,
    isLoading: isLoadingSong,
    isError,
  } = useQuery({
    queryKey: ["admin_song", songId],
    queryFn: () => getSongById(songId),
    enabled: Number.isInteger(songId) && songId > 0,
  });

  const { data: artistsData } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const artists = artistsData?.artists ?? [];
  const categories = categoriesData?.categories ?? [];

  // Συμπληρώνουμε τη φόρμα μόλις φορτωθούν τα στοιχεία του τραγουδιού.
  useEffect(() => {
    const song = songData?.song?.[0];

    if (!song) return;

    setFormData({
      title: song.title ?? "",
      artist_id: String(song.artist_id ?? ""),
      category_id: song.category_id,
      content: song.content ?? "",
    });
  }, [songData]);

  const updateMutation = useMutation({
    mutationFn: () => {
      return updateSong(songId, {
        title: formData.title.trim(),
        artist_id: Number(formData.artist_id),
        category_id: Number(formData.category_id),
        content: formData.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_songs"] });
      queryClient.invalidateQueries({ queryKey: ["admin_song", songId] });
      queryClient.invalidateQueries({ queryKey: ["songs_by_category"] });
      queryClient.invalidateQueries({ queryKey: ["artist_songs"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });

      alert("Το τραγούδι ενημερώθηκε επιτυχώς!");
      navigate("/admin/songs");
    },
    onError: (error: Error) => {
      alert(error.message || "Παρουσιάστηκε σφάλμα κατά την ενημέρωση.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Συμπλήρωσε τον τίτλο του τραγουδιού.");
      return;
    }

    if (!formData.artist_id) {
      alert("Επίλεξε καλλιτέχνη.");
      return;
    }

    if (!formData.category_id) {
      alert("Επίλεξε τουλάχιστον μία κατηγορία.");
      return;
    }

    if (!formData.content.trim()) {
      alert("Το περιεχόμενο του τραγουδιού είναι κενό.");
      return;
    }

    updateMutation.mutate();
  };

  if (!Number.isInteger(songId) || songId <= 0) {
    return (
      <p className="p-8 text-center text-red-600">Μη έγκυρο ID τραγουδιού.</p>
    );
  }

  if (isLoadingSong) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <Loader2 size={32} className="animate-spin text-[#c6371a]" />
      </div>
    );
  }

  if (isError || !songData?.song) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] p-8 text-center">
        <p className="text-red-600">
          Δεν ήταν δυνατή η φόρτωση του τραγουδιού.
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/songs")}
          className="mt-4 text-[#c6371a] underline"
        >
          Επιστροφή στα τραγούδια
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/admin/songs")}
          className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-[#c6371a]"
        >
          <ArrowLeft size={20} />
          Πίσω στα τραγούδια
        </button>

        <h1 className="mb-6 text-2xl font-bold text-[#080808]">
          Επεξεργασία Τραγουδιού
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Τίτλος τραγουδιού
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#c6371a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Καλλιτέχνης
              </label>
              <select
                value={formData.artist_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    artist_id: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#c6371a]"
              >
                <option value="">Επιλογή καλλιτέχνη</option>
                {artists.map((artist: { id: number; name: string }) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Κατηγορίες
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }));
                }}
                className="h-[48px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#c6371a]"
              >
                {categories.map((category: { id: number; name: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Για πολλαπλές επιλογές κράτησε πατημένο το Ctrl.
              </p>
            </div>
          </div>

          <div className="grid min-h-[550px] grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3 font-semibold">
                ChordPro Editor
              </div>

              <div className="h-[550px]">
                <Editor
                  value={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  settings={{
                    theme: "textmate",
                    fontSize: 14,
                    wordWrap: true,
                    showLineNumbers: true,
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3 font-semibold">
                Preview
              </div>

              <div className="p-4">
                <ChordProRenderer
                  content={formData.content}
                  showChords={true}
                  instrument="guitar"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#c6371a] px-6 py-3 font-semibold text-white transition hover:bg-[#a92e16] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Αποθήκευση...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Αποθήκευση αλλαγών
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditSong;
