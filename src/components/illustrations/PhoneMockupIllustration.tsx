import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, ShieldCheck, Check } from 'lucide-react';

export const PhoneMockupIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative mx-auto max-w-[340px] sm:max-w-[360px] ${className}`}>
      {/* Soft warm aura glow behind phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#A8C5DA]/20 via-[#FBEBC6]/40 to-[#A9C4B0]/20 rounded-[44px] filter blur-xl -z-10" />

      {/* Phone chassis */}
      <div className="relative bg-[#FFFDF9] dark:bg-[#1C2421] border-4 border-[#1F2A27] dark:border-[#384A43] rounded-[38px] shadow-warm-lg overflow-hidden p-3 pt-4">
        {/* Phone Speaker & Camera Notch */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-4 bg-[#1F2A27] rounded-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#384A43]" />
            <div className="w-8 h-1 bg-[#384A43] rounded-full" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="bg-[#FAF6EF] dark:bg-[#141A18] rounded-[26px] overflow-hidden border border-[#E6DECF] dark:border-[#2B3833] p-3 space-y-3">
          {/* Mock App Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[#F2B84B] text-[#1F2A27] font-display font-black text-xs flex items-center justify-center">
                RW
              </span>
              <span className="font-display font-bold text-sm text-[#1F2A27] dark:text-[#FAF6EF]">
                RouteWala
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#E3EEE6] text-[#4F7A66] text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F8F66] animate-pulse" />
              Live Corridor
            </span>
          </div>

          {/* Interactive Stylised Mini-Map */}
          <div className="relative h-44 bg-[#F2ECE1] dark:bg-[#101514] rounded-2xl overflow-hidden border border-[#E6DECF] dark:border-[#2B3833]">
            {/* SVG Roads & Drawn Dashed Route */}
            <svg viewBox="0 0 300 200" className="w-full h-full">
              {/* Soft background roads */}
              <path d="M 0 50 Q 150 70 300 40" stroke="#E6DECF" strokeWidth="12" fill="none" />
              <path d="M 60 0 L 100 200" stroke="#E6DECF" strokeWidth="8" fill="none" />
              <path d="M 220 0 L 180 200" stroke="#E6DECF" strokeWidth="10" fill="none" />
              <path d="M 0 140 Q 150 120 300 150" stroke="#E6DECF" strokeWidth="10" fill="none" />

              {/* Animated Marigold Delivery Polyline */}
              <motion.path
                d="M 40 160 C 80 130, 110 90, 150 110 C 190 130, 210 60, 260 50"
                stroke="#F2B84B"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 2 }}
              />

              {/* Waypoint 1 (Dadar) */}
              <circle cx="40" cy="160" r="7" fill="#3F8F66" stroke="#FFFDF9" strokeWidth="2.5" />

              {/* Waypoint 2 (Lower Parel) */}
              <circle cx="150" cy="110" r="8" fill="#F2B84B" stroke="#FFFDF9" strokeWidth="2.5" />

              {/* Waypoint 3 (Colaba) */}
              <circle cx="260" cy="50" r="8" fill="#D9604C" stroke="#FFFDF9" strokeWidth="2.5" />
            </svg>

            {/* Floating Live Pitstop Notification */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-2 left-2 right-2 p-2 bg-[#FFFDF9]/95 dark:bg-[#1C2421]/95 backdrop-blur-sm rounded-xl border border-[#E6DECF] dark:border-[#2B3833] shadow-warm-sm flex items-center justify-between text-[11px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#FCE3D9] text-[#D9604C] flex items-center justify-center font-bold text-[10px]">
                  💊
                </span>
                <div>
                  <div className="font-bold text-[#1F2A27] dark:text-[#FAF6EF]">Wellness Forever</div>
                  <div className="text-[10px] text-[#55625D] dark:text-[#95A39D] font-mono">120m off route · +2m</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#F2B84B] text-[#1F2A27] font-bold text-[10px]">
                Add Stop
              </span>
            </motion.div>
          </div>

          {/* Active Stop Card on Screen */}
          <div className="bg-[#FFFDF9] dark:bg-[#1C2421] p-3 rounded-2xl border border-[#E6DECF] dark:border-[#2B3833] shadow-warm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1F2A27] text-[#FAF6EF] font-mono text-xs font-bold flex items-center justify-center">
                  03
                </span>
                <div>
                  <div className="font-display font-bold text-xs text-[#1F2A27] dark:text-[#FAF6EF]">
                    Kunal Singhania
                  </div>
                  <div className="text-[10px] text-[#55625D] dark:text-[#95A39D] truncate max-w-[160px]">
                    One World Center, Lower Parel
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FBE1DB] text-[#D9604C] text-[10px] font-bold">
                High
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center justify-between text-[11px] font-mono border-t border-[#E6DECF]/60 dark:border-[#2B3833] pt-2 text-[#55625D] dark:text-[#95A39D]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E0A11B]" />
                1:45 PM
              </span>
              <span>₹1,250 COD</span>
              <span className="text-[#3F8F66] font-bold">12m away</span>
            </div>

            {/* Giant One-Hand Delivered CTA */}
            <button
              type="button"
              className="w-full h-10 rounded-full bg-[#F2B84B] hover:bg-[#E9A92F] text-[#1F2A27] font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-warm-sm transition-all"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Delivered / Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

