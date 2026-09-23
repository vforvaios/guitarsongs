import { Skeleton } from "@mui/material";

const ArtistSelectSkeleton = () => {
  return (
    <section className="artist-filter">
      <Skeleton
        variant="rounded"
        width="100%"
        height={48}
        sx={{ borderRadius: "12px" }}
      />
    </section>
  );
};

export default ArtistSelectSkeleton;
