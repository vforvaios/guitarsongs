import { Skeleton } from "@mui/material";

export default function SongSkeleton() {
  return (
    <div className="song-page">
      {/* Header */}
      <header className="song-page__header">
        <div className="song-page__header-top">
          <Skeleton variant="circular" width={40} height={40} />

          <div className="song-page__header-actions">
            <Skeleton variant="circular" width={40} height={40} />

            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>

        {/* Song title */}
        <div className="song-page__title">
          <Skeleton variant="text" width="65%" height={42} />

          <Skeleton variant="text" width="35%" height={26} />
        </div>

        {/* Metadata */}
        <div className="song-page__meta">
          <Skeleton variant="rounded" width={70} height={28} />

          <Skeleton variant="rounded" width={90} height={28} />
        </div>
      </header>

      {/* Lyrics */}
      <main className="song-page__content">
        <div className="song-page__lyrics">
          {/* Verse 1 */}
          <div className="lyrics-section">
            <Skeleton variant="text" width="85%" height={24} />

            <div className="lyrics-line">
              <Skeleton variant="text" width={55} height={20} />
              <Skeleton variant="text" width="90%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={45} height={20} />
              <Skeleton variant="text" width="75%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={65} height={20} />
              <Skeleton variant="text" width="88%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={50} height={20} />
              <Skeleton variant="text" width="68%" height={26} />
            </div>
          </div>

          {/* Chorus */}
          <div className="lyrics-section">
            <Skeleton variant="text" width="60%" height={24} />

            <div className="lyrics-line">
              <Skeleton variant="text" width={48} height={20} />
              <Skeleton variant="text" width="92%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width="82%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={42} height={20} />
              <Skeleton variant="text" width="72%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={55} height={20} />
              <Skeleton variant="text" width="88%" height={26} />
            </div>
          </div>

          {/* Verse 2 */}
          <div className="lyrics-section">
            <Skeleton variant="text" width="75%" height={24} />

            <div className="lyrics-line">
              <Skeleton variant="text" width={50} height={20} />
              <Skeleton variant="text" width="80%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={65} height={20} />
              <Skeleton variant="text" width="94%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={45} height={20} />
              <Skeleton variant="text" width="70%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={58} height={20} />
              <Skeleton variant="text" width="85%" height={26} />
            </div>
          </div>

          {/* Chorus */}
          <div className="lyrics-section">
            <Skeleton variant="text" width="60%" height={24} />

            <div className="lyrics-line">
              <Skeleton variant="text" width={55} height={20} />
              <Skeleton variant="text" width="90%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={45} height={20} />
              <Skeleton variant="text" width="80%" height={26} />
            </div>

            <div className="lyrics-line">
              <Skeleton variant="text" width={65} height={20} />
              <Skeleton variant="text" width="92%" height={26} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
