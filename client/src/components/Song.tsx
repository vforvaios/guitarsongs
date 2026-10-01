import { getSongById } from "@/services/songs";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SongSkeleton from "./loaders/SongSkeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import useChordAudio from "@/hooks/useChordAudio";
import { Minus, Pause, Play, Plus } from "lucide-react";

const MIN_SCROLL_SPEED = 1;
const MAX_SCROLL_SPEED = 10;

// Pixels / second ανά speed level
const PIXELS_PER_SECOND = 15;

const Song = () => {
  const chordContainerRef = useRef<HTMLDivElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  const lastFrameTimeRef = useRef<number | null>(null);

  const scrollSpeedRef = useRef(3);

  const songId = useParams().id;

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const [scrollSpeed, setScrollSpeed] = useState(3);

  const { data, isFetching } = useQuery({
    queryKey: ["song_by_id", songId],
    queryFn: () => getSongById(Number(songId)),
    refetchOnWindowFocus: false,
  });

  const { playChord, loading } = useChordAudio();

  // --------------------------------------------------
  // Chord click
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Stop auto scroll
  // --------------------------------------------------

  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = null;
    }

    lastFrameTimeRef.current = null;
  }, []);

  // --------------------------------------------------
  // Start auto scroll
  // --------------------------------------------------

  const startAutoScroll = useCallback(() => {
    // Μην ξεκινήσεις δεύτερο animation
    if (animationFrameRef.current !== null) {
      return;
    }

    setIsAutoScrolling(true);

    lastFrameTimeRef.current = null;

    const scroll = (timestamp: number) => {
      // Πρώτο frame
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;

      lastFrameTimeRef.current = timestamp;

      // Συνολικό ύψος της σελίδας
      const documentHeight = document.documentElement.scrollHeight;

      // Ύψος viewport
      const viewportHeight = window.innerHeight;

      // Πόσο μπορούμε ακόμα να κάνουμε scroll
      const maxScroll = documentHeight - viewportHeight;

      // Τρέχουσα θέση
      const currentScroll = window.scrollY;

      // Έφτασε στο τέλος
      if (currentScroll >= maxScroll - 1) {
        stopAutoScroll();
        return;
      }

      // Pixels ανά δευτερόλεπτο
      const pixelsPerSecond = scrollSpeedRef.current * PIXELS_PER_SECOND;

      // Πόσα pixels πρέπει να κινηθούμε
      // σε αυτό το frame
      const pixelsToScroll = (pixelsPerSecond * deltaTime) / 1000;

      window.scrollBy(0, pixelsToScroll);

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);
  }, [stopAutoScroll]);

  // --------------------------------------------------
  // Toggle
  // --------------------------------------------------

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  // --------------------------------------------------
  // Speed
  // --------------------------------------------------

  const decreaseSpeed = () => {
    setScrollSpeed((currentSpeed) => {
      const newSpeed = Math.max(MIN_SCROLL_SPEED, currentSpeed - 1);

      scrollSpeedRef.current = newSpeed;

      return newSpeed;
    });
  };

  const increaseSpeed = () => {
    setScrollSpeed((currentSpeed) => {
      const newSpeed = Math.min(MAX_SCROLL_SPEED, currentSpeed + 1);

      scrollSpeedRef.current = newSpeed;

      return newSpeed;
    });
  };

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = null;

      lastFrameTimeRef.current = null;
    };
  }, []);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="song-page">
      {isFetching ? (
        <SongSkeleton />
      ) : (
        <div
          ref={chordContainerRef}
          className="px-4 py-4 sm:px-6 bg-slate-50 dark:bg-slate-950 print-page select-text leading-relaxed no-scrollbar relative"
        >
          {/* ----------------------------------------
              Auto scroll controls
          ---------------------------------------- */}

          <div
            style={{
              position: "fixed",
              top: "16px",
              right: "6px",
              zIndex: 1000,

              display: "flex",
              alignItems: "center",
              gap: "6px",

              padding: "6px",

              borderRadius: "12px",

              background: "rgba(255, 255, 255, 0.95)",

              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",

              backdropFilter: "blur(8px)",
            }}
          >
            {/* Play / Pause */}

            <button
              type="button"
              onClick={toggleAutoScroll}
              aria-label={
                isAutoScrolling
                  ? "Σταμάτημα αυτόματου scroll"
                  : "Έναρξη αυτόματου scroll"
              }
              style={{
                width: "40px",
                height: "40px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: "none",
                borderRadius: "8px",

                background: isAutoScrolling ? "#dc2626" : "#111827",

                color: "#fff",

                cursor: "pointer",
              }}
            >
              {isAutoScrolling ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Decrease */}

            <button
              type="button"
              onClick={decreaseSpeed}
              disabled={scrollSpeed <= MIN_SCROLL_SPEED}
              aria-label="Μείωση ταχύτητας"
              style={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: "none",
                borderRadius: "7px",

                background: "#f1f5f9",

                cursor:
                  scrollSpeed <= MIN_SCROLL_SPEED ? "not-allowed" : "pointer",

                opacity: scrollSpeed <= MIN_SCROLL_SPEED ? 0.4 : 1,
              }}
            >
              <Minus size={16} />
            </button>

            {/* Speed */}

            <span
              style={{
                minWidth: "28px",
                textAlign: "center",

                fontSize: "13px",
                fontWeight: 700,

                color: "#111827",
              }}
            >
              {scrollSpeed}
            </span>

            {/* Increase */}

            <button
              type="button"
              onClick={increaseSpeed}
              disabled={scrollSpeed >= MAX_SCROLL_SPEED}
              aria-label="Αύξηση ταχύτητας"
              style={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                border: "none",
                borderRadius: "7px",

                background: "#f1f5f9",

                cursor:
                  scrollSpeed >= MAX_SCROLL_SPEED ? "not-allowed" : "pointer",

                opacity: scrollSpeed >= MAX_SCROLL_SPEED ? 0.4 : 1,
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* ----------------------------------------
              Song header
          ---------------------------------------- */}

          <h2
            style={{
              fontSize: "25px",
              fontWeight: 700,
              textAlign: "center",
              paddingRight: "160px",
            }}
          >
            {data?.song[0]?.artistName}
          </h2>

          {data?.song[0]?.strumming_pattern ? (
            <h3
              style={{
                textAlign: "center",
              }}
            >
              {data.song[0].strumming_pattern}
            </h3>
          ) : null}

          {/* ----------------------------------------
              ChordPro
          ---------------------------------------- */}

          <ChordProRenderer
            content={data?.song[0]?.content}
            showChords={true}
            showDiagrams={false}
          />
        </div>
      )}
    </div>
  );
};

export default Song;
