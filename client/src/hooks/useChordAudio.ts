import { useCallback, useEffect, useRef, useState } from "react";
import Soundfont from "soundfont-player";

type SoundfontInstrument = {
  play: (
    note: string,
    when?: number,
    options?: {
      duration?: number;
      gain?: number;
    },
  ) => any;
};

const CHORDS: Record<string, string[]> = {
  C: ["C3", "G3", "C4", "E4", "G4"],
  Cm: ["C3", "G3", "C4", "D#4", "G4"],

  D: ["D3", "A3", "D4", "F#4", "A4"],
  Dm: ["D3", "A3", "D4", "F4", "A4"],

  E: ["E2", "B2", "E3", "G#3", "B3", "E4"],
  Em: ["E2", "B2", "E3", "G3", "B3", "E4"],

  F: ["F2", "C3", "F3", "A3", "C4", "F4"],
  Fm: ["F2", "C3", "F3", "G#3", "C4", "F4"],

  G: ["G2", "D3", "G3", "B3", "D4", "G4"],
  Gm: ["G2", "D3", "G3", "A#3", "D4", "G4"],

  A: ["A2", "E3", "A3", "C#4", "E4"],
  Am: ["A2", "E3", "A3", "C4", "E4"],

  B: ["B2", "F#3", "B3", "D#4", "F#4"],
  Bm: ["B2", "F#3", "B3", "D4", "F#4"],
};

const useChordAudio = () => {
  const guitarRef = useRef<SoundfontInstrument | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

    const audioContext = new AudioContextClass();

    audioContextRef.current = audioContext;

    Soundfont.instrument(audioContext, "acoustic_guitar_steel")
      .then((instrument) => {
        guitarRef.current = instrument as SoundfontInstrument;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Guitar loading error:", error);
        setLoading(false);
      });

    return () => {
      guitarRef.current = null;

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playNotes = useCallback(async (notes: string[]) => {
    const guitar = guitarRef.current;
    const audioContext = audioContextRef.current;

    if (!guitar || !audioContext) return;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const now = audioContext.currentTime;

    notes.forEach((note, index) => {
      guitar.play(note, now + index * 0.035, {
        duration: 2,
      });
    });
  }, []);

  const playChord = useCallback(
    async (chord: string) => {
      const notes = CHORDS[chord];

      if (!notes) {
        console.warn(`Chord "${chord}" is not mapped.`);
        return;
      }

      await playNotes(notes);
    },
    [playNotes],
  );

  return {
    playChord,
    playNotes,
    loading,
  };
};

export default useChordAudio;
