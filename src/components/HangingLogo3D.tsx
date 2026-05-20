import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface HangingLogo3DProps {
  scale?: number; // Size scale modifier
  className?: string;
}

export default function HangingLogo3D({ scale = 1, className = "" }: HangingLogo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // States to track pupil movement & blinking
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // React springs for 3D tilting hover physics on the sign board
  const rotateX = useSpring(0, { stiffness: 100, damping: 12 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 12 });
  const translateZ = useSpring(0, { stiffness: 100, damping: 12 });

  // Handle periodic natural blinks
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4200); // Blink every 4.2 seconds
    return () => clearInterval(blinkInterval);
  }, []);

  // Track cursor position on screen to look at it
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Max pupil offset is 3px to keep it aligned within eyes
      const maxOffset = 3.5;
      const offsetFactor = Math.min(distance / 250, 1);
      const angle = Math.atan2(dy, dx);

      setPupilOffset({
        x: Math.cos(angle) * maxOffset * offsetFactor,
        y: Math.sin(angle) * maxOffset * offsetFactor,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle mouse movements over the board to tilt it in 3D
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Convert cursor relative offset to tilt values (-8 to 8 degrees)
    const factorX = 12; // tilt sensitivity
    const factorY = 12;
    rotateX.set(-(y / (rect.height / 2)) * factorX);
    rotateY.set((x / (rect.width / 2)) * factorY);
    translateZ.set(15);
  };

  const handleMouseLeave3D = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateZ.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none perspective-1000 flex flex-col items-center justify-start ${className}`}
      style={{
        width: `${190 * scale}px`,
        height: `${135 * scale}px`,
        transformOrigin: "top center",
      }}
    >
      {/* 3D Ropes / Strings going down to eyelets */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 overflow-visible pointer-events-none"
        width={`${140 * scale}px`}
        height={`${40 * scale}px`}
        viewBox="0 0 140 40"
        fill="none"
      >
        {/* Shadow or faint outline of ropes */}
        <path
          d="M 70 0 L 25 36 M 70 0 L 115 36"
          stroke="rgba(15, 46, 147, 0.15)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Real organic-textured hanging cotton strings */}
        <path
          d="M 70 2 C 55 12, 40 24, 25 36 M 70 2 C 85 12, 100 24, 115 36"
          stroke="#d2b48c"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="stroke-brand-green/70"
        />
        {/* Small loop node at the top hanging screw */}
        <circle cx="70" cy="2" r="3.5" fill="#a08050" className="fill-brand-clay" />
        <circle cx="70" cy="2" r="1.5" fill="#fcf8f2" />
      </svg>

      {/* Embedded High Fidelity 3D Signboard */}
      <motion.div
        className="absolute bottom-0 w-full bg-white rounded-xl border border-brand-green/25 flex flex-col shadow-lg overflow-hidden cursor-pointer preserve-3d"
        style={{
          height: `${100 * scale}px`,
          rotateX,
          rotateY,
          z: translateZ,
          boxShadow: "0 10px 25px -5px rgba(15, 46, 147, 0.18), 0 8px 10px -6px rgba(15, 46, 147, 0.1)",
          animation: "signboard-organic-sway 4.5s ease-in-out infinite",
          transformOrigin: "50% -30px", // Animates hanging physics perfectly
        }}
        onMouseMove={handleMouseMove3D}
        onMouseLeave={handleMouseLeave3D}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Sign Holder Inner Panel with border detail */}
        <div className="absolute inset-1 rounded-[10px] border border-dashed border-brand-green/15 pointer-events-none" />

        {/* Grommets / Metallic Top Eyelet Holes */}
        <div className="absolute top-2 left-6 w-3 h-3 bg-gray-100 rounded-full border border-gray-400 mt-0.5 flex items-center justify-center shadow-inner z-20">
          <div className="w-1.5 h-1.5 bg-[#0a1535] rounded-full border border-gray-200" />
        </div>
        <div className="absolute top-2 right-6 w-3 h-3 bg-gray-100 rounded-full border border-gray-400 mt-0.5 flex items-center justify-center shadow-inner z-20">
          <div className="w-1.5 h-1.5 bg-[#0a1535] rounded-full border border-gray-200" />
        </div>

        {/* Brand Text Content Area */}
        <div className="flex-1 flex flex-col justify-start items-center pt-5 px-3 relative">
          
          {/* Trademark Logo marker (TM) */}
          <span className="absolute top-[18px] right-[24px] font-sans text-[5.5px] font-bold text-brand-green/70 select-none">
            TM
          </span>

          {/* Logo Title text line 1 */}
          <div className="flex items-end justify-center gap-[0.5px] select-none scale-[0.88] origin-top">
            <div className="flex flex-col items-center">
              {/* "The" positioned neatly فوق */}
              <span className="font-rounded font-extrabold text-[7px] text-[#0F2E93] leading-none mb-[2px] self-start ml-[2px]">
                The
              </span>
              <span className="font-rounded font-extrabold text-[15px] text-[#0F2E93] leading-none tracking-tight">
                Un
              </span>
            </div>
            
            <span className="font-rounded font-extrabold text-[15px] text-[#0F2E93] leading-none tracking-tight">
              scho
            </span>

            {/* TWO CUTE CHARACTER EYE-OO's */}
            <div className="flex items-center gap-[0.5px] pb-[0.5px] relative">
              
              {/* Left Eyeball */}
              <div
                ref={leftEyeRef}
                className="w-4 h-4 rounded-full bg-white border border-[#0F2E93] shadow-inner relative flex items-center justify-center overflow-hidden transition-all duration-100"
                style={{
                  transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
                }}
              >
                {/* Pupil with Gloss Highlight reflect dot */}
                <div
                  className="w-[7px] h-[7px] bg-[#111116] rounded-full relative flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  <div className="absolute top-0.5 right-0.5 w-[2px] h-[2px] bg-white rounded-full" />
                </div>
              </div>

              {/* Right Eyeball */}
              <div
                ref={rightEyeRef}
                className="w-4 h-4 rounded-full bg-white border border-[#0F2E93] shadow-inner relative flex items-center justify-center overflow-hidden transition-all duration-100"
                style={{
                  transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
                }}
              >
                {/* Pupil with Gloss Highlight reflect dot */}
                <div
                  className="w-[7px] h-[7px] bg-[#111116] rounded-full relative flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  }}
                >
                  <div className="absolute top-0.5 right-0.5 w-[2px] h-[2px] bg-white rounded-full" />
                </div>
              </div>

              {/* Big, warm smiley curved mouth underneath the eyes */}
              <svg
                className="absolute top-[17px] left-1/2 -translate-x-1/2 overflow-visible"
                width="15px"
                height="6px"
                viewBox="0 0 15 6"
                fill="none"
              >
                <path
                  d="M 1 1 Q 7.5 5.5 14 1"
                  stroke="#0F2E93"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* "led" with custom color accents */}
            <div className="flex items-baseline gap-[1px] leading-none select-none ml-[2.5px]">
              {/* L in yellow */}
              <span className="font-rounded font-black text-[15px] text-[#FBCE3F] transform skew-x-3">
                l
              </span>
              {/* E in brand clay (crimson/red) */}
              <span className="font-rounded font-black text-[13px] text-[#FF3B5D]">
                e
              </span>
              {/* D with a dynamic customized target circle inside */}
              <div className="relative inline-block">
                <span className="font-rounded font-extrabold text-[15px] text-[#0F2E93]">
                  d
                </span>
                <div className="absolute top-[6.5px] left-[1.5px] w-[3px] h-[3px] bg-[#FF3B5D] rounded-full animate-ping opacity-75" />
                <div className="absolute top-[6.5px] left-[1.5px] w-[3.2px] h-[3.2px] bg-[#FF3B5D] rounded-full" />
              </div>
            </div>
          </div>

          {/* Logo Title text line 2: "Mind" with compass needle over 'i' */}
          <div className="flex items-center justify-center relative select-none mt-[4px] scale-[0.9] origin-top">
            <span className="font-rounded font-extrabold text-[16px] text-[#0F2E93] tracking-tight flex items-baseline">
              M
              {/* Special Custom "i" with the Compass needle */}
              <span className="relative inline-block mx-[1.5px] select-none">
                <span className="opacity-0">i</span> {/* spacer */}
                <span className="absolute inset-x-0 bottom-0 text-[16px] text-transparent leading-none">i</span>
                {/* Pointer Arrow */}
                <div className="absolute -top-[5px] left-1/2 -translate-x-[45%] w-1.5 h-1.5 rotate-45 border-l-[1.5px] border-t-[1.5px] border-[#FF3B5D] origin-center animate-bounce duration-1000" />
                {/* Stem of i */}
                <div className="absolute bottom-[1.5px] left-1/2 -translate-x-1/2 w-1.5 h-2 bg-[#0F2E93] rounded-[1px] shadow-sm" />
              </span>
              nd
            </span>

            {/* Double underline decoration */}
            <div className="absolute -bottom-[3.5px] left-1/2 -translate-x-1/2 w-[85px] h-[1.8px] bg-gradient-to-r from-transparent via-brand-clay to-transparent" />
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[60px] h-[0.8px] bg-gradient-to-r from-transparent via-[#FBCE3F] to-transparent" />
          </div>
        </div>

        {/* BOTTOM WOODEN/YELLOW BASE/RAIL carrying tagline */}
        <div className="relative h-[22px] bg-[#FBCE3F] border-t-2 border-brand-green/80 flex items-center justify-center py-0.5 px-2">
          {/* Subtle wood grain or ray reflections overlay on the tagline panel */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none select-none" />
          <span className="font-sans font-bold text-[7.5px] tracking-wide text-brand-green select-none uppercase leading-none">
            A School... Beyond The Books
          </span>
        </div>
      </motion.div>

      {/* Embedded local keyframes styles for the perfect swinging physics */}
      <style>{`
        @keyframes signboard-organic-sway {
          0%, 100% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }
      `}</style>
    </div>
  );
}
