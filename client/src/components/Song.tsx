import { getSongById } from "@/services/songs";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SongSkeleton from "./loaders/SongSkeleton";

const Song = () => {
  const songId = useParams().id;
  const { data, isFetching } = useQuery({
    queryKey: ["song_by_id"],
    queryFn: () => {
      return getSongById(Number(songId));
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="song-page">
      {isFetching ? (
        <SongSkeleton />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 bg-slate-50 dark:bg-slate-950 print-page select-text leading-relaxed no-scrollbar relative"
        >
          <h2 style={{ fontSize: "25px", fontWeight: 700 }}>
            {data?.song[0]?.artistName}
          </h2>
          {data?.song[0]?.strumming_pattern ? (
            <h3>{data?.song[0]?.strumming_pattern}</h3>
          ) : null}
          <ChordProRenderer
            content={data?.song[0]?.content}
            showChords={true}
            instrument="guitar"
          />
        </div>
      )}
    </div>
  );
};

export default Song;
