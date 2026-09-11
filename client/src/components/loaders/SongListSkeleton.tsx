import { Skeleton } from "@mui/material";

export default function SongListSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="song-row">
          <div className="song-row__info">
            <Skeleton
              variant="text"
              width={`${55 + (index % 3) * 15}%`}
              height={28}
            />
          </div>

          <div className="song-row__actions">
            <Skeleton variant="circular" width={20} height={20} />
          </div>
        </div>
      ))}
    </>
  );
}
