import { Skeleton } from "@mui/material";

const CategorySkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2%",
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="category-card"
          style={{
            cursor: "default",
          }}
        >
          {/* Icon */}
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            sx={{
              borderRadius: "12px",
              flexShrink: 0,
            }}
          />

          {/* Title */}
          <div className="category-info">
            <Skeleton
              variant="text"
              width={index % 2 === 0 ? 90 : 150}
              height={24}
            />
          </div>

          {/* Arrow */}
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            sx={{
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
