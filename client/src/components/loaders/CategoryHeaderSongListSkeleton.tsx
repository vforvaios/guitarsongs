import { Skeleton } from "@mui/material";

export default function CategorySongsHeaderSkeleton() {
  return (
    <header className="category-songs__header">
      {/* Top */}
      <div className="category-songs__header-top">
        <Skeleton variant="circular" width={40} height={40} />

        <Skeleton variant="text" width={45} height={24} />

        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{ marginLeft: "auto" }}
        />
      </div>

      {/* Title */}
      <div className="category-songs__title-row">
        <div>
          <Skeleton variant="text" width={180} height={48} />
        </div>

        <Skeleton
          variant="rounded"
          width={54}
          height={54}
          sx={{
            borderRadius: "14px",
          }}
        />
      </div>

      {/* Stats */}
      <div className="category-songs__stats">
        <div className="category-songs__stat">
          <Skeleton variant="circular" width={18} height={18} />

          <Skeleton variant="text" width={100} height={24} />
        </div>
      </div>
    </header>
  );
}
