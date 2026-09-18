import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Radio, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useAmbientAudio } from "@/context/AmbientAudioContext";

const DesktopAmbientSpeaker = () => {
  const { isPlaying, selectedTrack, togglePlay, changeTrack, tracks } = useAmbientAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-40">
      <motion.div
        layout
        className="bg-white/95 backdrop-blur-xl border border-[#E6DCCE] rounded-2xl shadow-soft-lg overflow-hidden text-[#182A4A] transition-all"
      >
        {/* Compact Pill Bar */}
        <div className="flex items-center gap-2 p-1.5 px-2.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Mute Studio Ambient Audio" : "Play Spa Sanctuary Sound"}
            className={`p-2 rounded-xl transition flex items-center justify-center ${
              isPlaying
                ? "bg-[#182A4A] text-[#C89B3C] shadow-soft-xs"
                : "bg-[#FAF6EE] text-[#8C7A6B] hover:text-[#182A4A] hover:bg-[#FAF2DE]"
            }`}
            title={isPlaying ? "Pause Ambient Audio" : "Play Spa Ambience (Web Audio)"}
          >
            {isPlaying ? (
              <Volume2 size={15} className="text-[#C89B3C] animate-pulse" />
            ) : (
              <VolumeX size={15} />
            )}
          </button>

          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer select-none pr-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#C89B3C]">
                SANCTUARY SOUND
              </span>
              {isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <span className="text-xs font-bold text-[#182A4A] block truncate max-w-[130px]">
              {selectedTrack.name.split(" (")[0]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle sound options"
            className="p-1 text-[#9A8F7F] hover:text-[#182A4A] transition"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {/* Expandable Track Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3 pt-1 border-t border-[#FAF6EE] space-y-1.5 text-xs w-60"
            >
              <div className="flex items-center justify-between pb-1">
                <span className="text-[9px] font-extrabold uppercase text-[#9A8F7F] tracking-wider">
                  Select Frequency:
                </span>
                <span className="text-[9px] font-bold text-[#C89B3C]">Web Audio 432Hz</span>
              </div>

              <div className="space-y-1">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      changeTrack(track);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition ${
                      selectedTrack.id === track.id && isPlaying
                        ? "bg-[#182A4A] text-white font-bold"
                        : "hover:bg-[#FAF6EE] text-[#182A4A]"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-semibold">{track.name.split(" (")[0]}</span>
                      <span
                        className={`text-[9px] ${
                          selectedTrack.id === track.id && isPlaying
                            ? "text-[#C89B3C]"
                            : "text-[#8C7A6B]"
                        }`}
                      >
                        {track.mood}
                      </span>
                    </div>
                    {selectedTrack.id === track.id && isPlaying && (
                      <Radio size={12} className="text-[#C89B3C] animate-pulse" />
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

export default DesktopAmbientSpeaker;
