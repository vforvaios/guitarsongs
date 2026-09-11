import { getSongById } from "@/services/songs";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SongSkeleton from "./loaders/SongSkeleton";

const Song = () => {
  const songId = useParams().id;
  const { data, isLoading } = useQuery({
    queryKey: ["song_by_id"],
    queryFn: () => {
      return getSongById(Number(songId));
    },
  });

  return (
    <div>
      {isLoading ? (
        <SongSkeleton />
      ) : (
        <ChordProRenderer
          content={data?.song[0]?.content}
          showChords={true}
          instrument="guitar"
        />
      )}
    </div>
  );
};

export default Song;
