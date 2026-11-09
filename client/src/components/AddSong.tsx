import Editor from "@hosanna/chordpro/editor";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { createSong } from "@/services/songs";

import { getArtists } from "@/services/artists";
import { getCategories } from "@/services/categories";

const AddSong = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("{title: New Song}\n[C]Hello world");
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [categoryId, setCategoryId] = useState("1");

  const { data: artistsData, isFetching: isFetchingArtists } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const { data: categoriesData, isFetching: isFetchingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate: insertSong, isPending } = useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs_by_category"] });
      queryClient.invalidateQueries({ queryKey: ["artists_by_category"] });
      queryClient.invalidateQueries({ queryKey: ["artist_songs"] });

      alert("Το τραγούδι αποθηκεύτηκε επιτυχώς!");
    },
    onError: (error) => {
      console.error(error);
      alert("Παρουσιάστηκε σφάλμα κατά την αποθήκευση.");
    },
  });

  const handleInsertSong = () => {
    if (!title.trim()) {
      alert("Συμπλήρωσε τον τίτλο του τραγουδιού.");
      return;
    }

    if (!artistId) {
      alert("Επίλεξε καλλιτέχνη.");
      return;
    }

    if (!categoryId) {
      alert("Επίλεξε τουλάχιστον μία κατηγορία.");
      return;
    }

    if (!content.trim()) {
      alert("Το περιεχόμενο του τραγουδιού είναι κενό.");
      return;
    }

    insertSong({
      title: title.trim(),
      artist_id: Number(artistId),
      category_id: Number(categoryId),
      content,
    });
  };

  const artists = artistsData?.artists ?? [];
  const categories = categoriesData?.categories ?? [];

  return (
    <div style={{ padding: "20px" }}>
      {/* Song information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Title */}
        <div>
          <label htmlFor="song-title">Τίτλος τραγουδιού</label>
          <input
            id="song-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Τίτλος τραγουδιού"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        {/* Artist */}
        <div>
          <label htmlFor="song-artist">Καλλιτέχνης</label>
          <select
            id="song-artist"
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            disabled={isFetchingArtists}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="">
              {isFetchingArtists ? "Φόρτωση..." : "Επιλογή καλλιτέχνη"}
            </option>

            {artists.map((artist: any) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label htmlFor="song-categories">Κατηγορίες</label>
          <select
            id="song-categories"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
            }}
            disabled={isFetchingCategories}
            style={{
              width: "100%",
              padding: "10px",
            }}
          >
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ChordPro Editor & Preview */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "start",
          height: "calc(100vh - 300px)",
          gap: "16px",
        }}
      >
        <div style={{ width: "50%", height: "100%" }}>
          <Editor
            value={content}
            onChange={setContent}
            onSave={(val) => console.log("Saved:", val)}
            settings={{
              theme: "textmate",
              fontSize: 14,
              wordWrap: true,
              showLineNumbers: true,
            }}
          />
        </div>

        <div style={{ width: "50%", height: "100%", overflowY: "auto" }}>
          <ChordProRenderer
            content={content}
            showChords={true}
            instrument="guitar"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          type="button"
          onClick={handleInsertSong}
          disabled={isPending}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            background: "#c6371a",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Save size={18} />
          {isPending ? "Αποθήκευση..." : "Αποθήκευση τραγουδιού"}
        </button>
      </div>
    </div>
  );
};

export default AddSong;
