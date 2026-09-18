import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export const TRACKS = [
  { id: "spa_bowls", name: "Zen Singing Bowls (432 Hz)", mood: "Deep Relaxation", type: "bowl" },
  { id: "mist_rain", name: "Gentle Sanctuary Rain", mood: "Stress Relief", type: "rain" },
  { id: "lounge_chords", name: "Botanical Day Spa", mood: "Serene Focus", type: "chords" },
];

const AmbientAudioContext = createContext();

export const AmbientAudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const gainNodeRef = useRef(null);
  const rainNodeRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = volume * 0.15;
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playBowlTone = (freq = 432) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.35 * volume, ctx.currentTime + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start();
    osc.stop(ctx.currentTime + 3.6);
  };

  const startRain = () => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    whiteNoise.connect(filter);
    filter.connect(gainNodeRef.current);
    whiteNoise.start();
    rainNodeRef.current = whiteNoise;
  };

  const stopRain = () => {
    if (rainNodeRef.current) {
      try {
        rainNodeRef.current.stop();
        rainNodeRef.current.disconnect();
      } catch {}
      rainNodeRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopRain();
      return;
    }

    initAudio();

    if (selectedTrack.type === "bowl") {
      stopRain();
      const frequencies = [432, 540, 648, 324];
      let idx = 0;
      playBowlTone(frequencies[0]);

      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % frequencies.length;
        playBowlTone(frequencies[idx]);
      }, 3500);
    } else if (selectedTrack.type === "rain") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      startRain();
    } else if (selectedTrack.type === "chords") {
      stopRain();
      const chordGroups = [
        [261.63, 329.63, 392.0],
        [220.0, 261.63, 329.63],
        [349.23, 440.0, 523.25],
        [196.0, 246.94, 293.66],
      ];
      let cIdx = 0;
      const playChord = (chord) => {
        chord.forEach((freq) => playBowlTone(freq));
      };
      playChord(chordGroups[0]);

      intervalRef.current = setInterval(() => {
        cIdx = (cIdx + 1) % chordGroups.length;
        playChord(chordGroups[cIdx]);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopRain();
    };
  }, [isPlaying, selectedTrack, volume]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying((prev) => !prev);
  };

  const changeTrack = (track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
  };

  return (
    <AmbientAudioContext.Provider
      value={{
        isPlaying,
        selectedTrack,
        volume,
        setVolume,
        togglePlay,
        changeTrack,
        tracks: TRACKS,
      }}
    >
      {children}
    </AmbientAudioContext.Provider>
  );
};

export const useAmbientAudio = () => {
  const context = useContext(AmbientAudioContext);
  if (!context) {
    return {
      isPlaying: false,
      selectedTrack: TRACKS[0],
      volume: 0.5,
      setVolume: () => {},
      togglePlay: () => {},
      changeTrack: () => {},
      tracks: TRACKS,
    };
  }
  return context;
};
