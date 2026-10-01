import { getSongById } from "@/services/songs";
import ChordProRenderer from "@hosanna/chordpro/renderer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SongSkeleton from "./loaders/SongSkeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import useChordAudio from "@/hooks/useChordAudio";
import { ArrowLeft, Minus, Pause, Play, Plus } from "lucide-react";

const MIN_SCROLL_SPEED = 1;
const MAX_SCROLL_SPEED = 10;

const Song = () => {
  const chordContainerRef = useRef<HTMLDivElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef(3);
  const scrollPositionRef = useRef(0);

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
    if (animationFrameRef.current !== null) {
      return;
    }

    setIsAutoScrolling(true);

    const currentScroll = window.scrollY;

    // Ξεκινάμε από την πραγματική θέση
    scrollPositionRef.current = currentScroll;
    lastFrameTimeRef.current = null;

    const getScrollSpeed = (speed: number) => {
      switch (speed) {
        case 1:
          return 20;
        case 2:
          return 40;
        case 3:
          return 70;
        case 4:
          return 110;
        case 5:
          return 160;
        case 6:
          return 220;
        case 7:
          return 300;
        case 8:
          return 400;
        case 9:
          return 520;
        case 10:
          return 650;
        default:
          return 20;
      }
    };

    const scroll = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;

      lastFrameTimeRef.current = timestamp;

      const documentHeight = document.documentElement.scrollHeight;

      const viewportHeight = window.innerHeight;

      const maxScroll = documentHeight - viewportHeight;

      if (scrollPositionRef.current >= maxScroll) {
        window.scrollTo(0, maxScroll);
        stopAutoScroll();
        return;
      }

      const pixelsPerSecond = getScrollSpeed(scrollSpeedRef.current);

      const pixelsToScroll = (pixelsPerSecond * deltaTime) / 1000;

      // Κρατάμε δεκαδική θέση
      scrollPositionRef.current += pixelsToScroll;

      // Κάνουμε το πραγματικό scroll
      window.scrollTo(0, Math.min(scrollPositionRef.current, maxScroll));

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
              Back
          ---------------------------------------- */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              aria-label="Πίσω"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: "8px",
                background: "#f1f5f9",
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={22} />
            </button>

            <span>Πίσω</span>
          </div>

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
              opacity: 0.6,
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
              paddingLeft: "46px",
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
