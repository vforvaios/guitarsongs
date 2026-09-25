import { getSongById } from "@/services/songs";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SongSkeleton from "./loaders/SongSkeleton";
import { useEffect, useRef } from "react";
import useChordAudio from "@/hooks/useChordAudio";

const Song = () => {
  const chordContainerRef = useRef<HTMLDivElement | null>(null);

  const songId = useParams().id;

  const { data, isFetching } = useQuery({
    queryKey: ["song_by_id", songId],
    queryFn: () => getSongById(Number(songId)),
    refetchOnWindowFocus: false,
  });

  const { playChord, loading } = useChordAudio();

  useEffect(() => {
    const container = chordContainerRef.current;

    if (!container || isFetching || loading) {
      return;
    }

    const handleChordClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const chordElement = target.closest(
        "span.cursor-pointer",
      ) as HTMLElement | null;

      if (!chordElement || !container.contains(chordElement)) {
        return;
      }

      const chord = chordElement.textContent?.trim();

      if (!chord) {
        return;
      }

      playChord(chord);
    };

    container.addEventListener("click", handleChordClick);

    return () => {
      container.removeEventListener("click", handleChordClick);
    };
  }, [isFetching, loading, playChord]);

  return (
    <div className="song-page">
      {isFetching ? (
        <SongSkeleton />
      ) : (
        <div
          ref={chordContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 bg-slate-50 dark:bg-slate-950 print-page select-text leading-relaxed no-scrollbar relative"
        >
          <h2
            style={{
              fontSize: "25px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {data?.song[0]?.artistName}
          </h2>

          {data?.song[0]?.strumming_pattern ? (
            <h3>{data.song[0].strumming_pattern}</h3>
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
