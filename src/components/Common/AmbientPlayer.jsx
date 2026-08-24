import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Play, Pause, Music, Radio, ChevronUp, ChevronDown } from "lucide-react";

const TRACKS = [
  { id: "spa_bowls", name: "Zen Singing Bowls (432 Hz)", mood: "Deep Relaxation", type: "bowl" },
  { id: "mist_rain", name: "Gentle Sanctuary Rain", mood: "Stress Relief", type: "rain" },
  { id: "lounge_chords", name: "Botanical Day Spa", mood: "Serene Focus", type: "chords" },
];

const AmbientPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const gainNodeRef = useRef(null);
  const rainNodeRef = useRef(null);

  // Initialize Web Audio Context
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

  // Play a soft singing bowl tone
  const playBowlTone = (freq = 432) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.4 * volume, ctx.currentTime + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start();
    osc.stop(ctx.currentTime + 3.6);
  };

  // Play rain noise
  const startRain = () => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it soft pink/brown rain
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

  // Sound generator loop
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
        [261.63, 329.63, 392.0], // C Maj
        [220.0, 261.63, 329.63], // A Min
        [349.23, 440.0, 523.25], // F Maj
        [196.0, 246.94, 293.66], // G Maj
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
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 md:left-6 z-40">
      <motion.div
        layout
        className="bg-white/95 backdrop-blur-xl border border-[#E6DCCE] rounded-2xl shadow-xl overflow-hidden text-[#182A4A]"
      >
        {/* Collapsed Pill */}
        <div className="flex items-center gap-2 p-2 px-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`p-2 rounded-xl transition flex items-center justify-center ${
              isPlaying
                ? "bg-[#182A4A] text-white shadow-xs"
                : "bg-[#FAF6EE] text-[#182A4A] hover:bg-[#FAF2DE]"
            }`}
            title={isPlaying ? "Pause Ambient Sound" : "Play Spa Sanctuary Sound"}
          >
            {isPlaying ? <Volume2 size={16} className="text-[#C89B3C] animate-pulse" /> : <VolumeX size={16} />}
          </button>

          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer select-none pr-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C89B3C]">
                SANCTUARY AUDIO
              </span>
              {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
            </div>
            <span className="text-xs font-bold text-[#182A4A] block truncate max-w-[130px]">
              {selectedTrack.name.split(" (")[0]}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#9A8F7F] hover:text-[#182A4A] transition"
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>

        {/* Expanded Track Selection Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3 pt-1 border-t border-[#FAF6EE] space-y-2 text-xs"
            >
              <span className="text-[9px] font-extrabold uppercase text-[#9A8F7F] tracking-wider block">
                Choose Studio Soundscape:
              </span>
              <div className="space-y-1">
                {TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedTrack(track);
                      setIsPlaying(true);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition ${
                      selectedTrack.id === track.id
                        ? "bg-[#182A4A] text-white font-bold"
                        : "hover:bg-[#FAF6EE] text-[#182A4A]"
                    }`}
                  >
                    <div>
                      <span className="block text-xs">{track.name}</span>
                      <span className={`text-[10px] ${selectedTrack.id === track.id ? "text-[#C89B3C]" : "text-[#5C6D88]"}`}>
                        {track.mood}
                      </span>
                    </div>
                    {selectedTrack.id === track.id && isPlaying && (
                      <Radio size={13} className="text-[#C89B3C] animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AmbientPlayer;
