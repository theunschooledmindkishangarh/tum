import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sparkles, Compass, Eye, Heart, BookOpen } from "lucide-react";

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for client coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for damping the movement
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);

  // Floating layers translate
  const layer1X = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);
  const layer1Y = useSpring(useTransform(mouseY, [-300, 300], [-10, 10]), springConfig);
  const layer2X = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig);
  const layer2Y = useSpring(useTransform(mouseY, [-300, 300], [-25, 25]), springConfig);
  const layer3X = useSpring(useTransform(mouseX, [-300, 300], [20, -20]), springConfig);
  const layer3Y = useSpring(useTransform(mouseY, [-300, 300], [20, -20]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from center
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touch = e.touches[0];
      
      mouseX.set(touch.clientX - centerX);
      mouseY.set(touch.clientY - centerY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const schoolPillars = [
    {
      title: "Child-Led Curiosity",
      description: "No textbooks, no forced curriculums. We pursue learning sparked by native child curiosity.",
      icon: <Compass className="w-5 h-5 text-brand-clay" />,
      color: "border-brand-clay hover:bg-brand-clay/5",
    },
    {
      title: "Nature as Class",
      description: "Organic farming, natural building, stargazing. Earth is our primary teacher and field.",
      icon: <LeafIcon className="w-5 h-5 text-brand-green" />,
      color: "border-brand-green hover:bg-brand-green/5",
    },
    {
      title: "Creative Hands",
      description: "Pottery wheel, carpentry jigs, watercolor murals, cooking. Real work with physical things.",
      icon: <Sparkles className="w-5 h-5 text-brand-yellow" />,
      color: "border-brand-yellow hover:bg-brand-yellow/5",
    },
  ];

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen bg-brand-sand pt-28 pb-16 flex items-center justify-center overflow-hidden perspective-2000"
    >
      {/* Background Organic Dot Pattern Overlay */}
      <div className="absolute inset-0 organic-grid pointer-events-none" />

      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-yellow/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-green/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        
        {/* Left Side: Editorial Typography & Philosophy Callout */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-clay/10 border border-brand-clay/20 text-brand-clay font-mono text-xs font-bold uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Empowering Alternative Education
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-brand-green leading-tight">
            Nurturing <span className="italic font-normal text-brand-clay">Curious Minds</span> Beyond Classrooms.
          </h1>

          <p className="font-rounded font-medium text-brand-green/80 text-base md:text-lg leading-relaxed max-w-xl">
            Welcome to <strong className="text-brand-green">The Unschooled Mind - Kishangarh</strong>, where learning is self-directed, nature is the lab, and playground clay teaches better than textbook blackboards. Here, we don't school; we liberate curiosity.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="clay-btn px-6 py-3.5 rounded-xl text-sm font-rounded font-bold flex items-center gap-2 group cursor-pointer"
            >
              Take a Virtual Tour
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                ➔
              </motion.span>
            </a>
            
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="clay-btn-secondary px-6 py-3.5 rounded-xl text-sm font-rounded font-bold flex items-center gap-2 cursor-pointer"
            >
              Get in Touch
            </a>
          </div>

          {/* Core Values Minimal Widgets */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-green/10 text-center font-rounded">
            <div>
              <div className="text-2xl font-bold text-brand-clay">100%</div>
              <div className="text-xs text-brand-green/60 font-semibold uppercase tracking-wider mt-0.5">Self-Directed</div>
            </div>
            <div className="border-x border-brand-green/10">
              <div className="text-2xl font-bold text-brand-green">Nature</div>
              <div className="text-xs text-brand-green/60 font-semibold uppercase tracking-wider mt-0.5">Primary Studio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-yellow">Kishangarh</div>
              <div className="text-xs text-brand-green/60 font-semibold uppercase tracking-wider mt-0.5">Rajasthan Heart</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Immersive interactive 3D Tilting Playground */}
        <div className="flex items-center justify-center w-full min-h-[400px] md:min-h-[500px]">
          <motion.div
            style={{ rotateX, rotateY }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative w-full max-w-[450px] aspect-square bg-[#061543] rounded-3xl border-4 border-brand-green shadow-[12px_12px_0px_0px_var(--color-brand-green)] flex items-center justify-center p-6 preserve-3d"
          >
            {/* Base platform texture or grid line */}
            <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-white/10 pointer-events-none" />

            {/* Simulated 3D Sandbox depth layer */}
            <div className="absolute inset-1 border border-white/20 rounded-2xl pointer-events-none" />

            {/* Embedded custom style sheet for high-fidelity interactive vector animations */}
            <style>{`
              .preserve-3d {
                transform-style: preserve-3d;
              }
              @keyframes kid-sway-left {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(-1deg); }
                50% { transform: translateY(-4px) translateX(-2px) rotate(1.5deg); }
              }
              @keyframes kid-sway-right {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(2deg); }
                50% { transform: translateY(-4.5px) translateX(2.5px) rotate(-1deg); }
              }
              @keyframes head-bob-left {
                0%, 100% { transform: rotate(-1deg) translateY(0px) translateX(0px); }
                50% { transform: rotate(2.5deg) translateY(-2px) translateX(1px); }
              }
              @keyframes head-bob-right {
                0%, 100% { transform: rotate(1.5deg) translateY(0px) translateX(0px); }
                50% { transform: rotate(-2deg) translateY(-2px) translateX(-1px); }
              }
              @keyframes blink-natural-left {
                0%, 88%, 94%, 100% { transform: scaleY(1); }
                91% { transform: scaleY(0.12); }
              }
              @keyframes blink-natural-right {
                0%, 85%, 91%, 100% { transform: scaleY(1); }
                88% { transform: scaleY(0.12); }
              }
              @keyframes ribbon-left {
                0%, 100% { transform: rotate(-3deg) translateY(0) scaleY(1); }
                50% { transform: rotate(-1deg) translateY(-1px) scaleY(1.05); }
              }
              @keyframes ribbon-right {
                0%, 100% { transform: rotate(2deg) translateY(0) scaleY(1); }
                50% { transform: rotate(4deg) translateY(-1px) scaleY(1.05); }
              }
              @keyframes pottery-spin-flat {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes morph-clay {
                0%, 100% { transform: scale(1, 1); filter: brightness(1); }
                50% { transform: scale(0.9, 1.1) translateY(-2px); filter: brightness(1.06); }
              }
              @keyframes hand-left-mold {
                0%, 100% { transform: translate(0px, 0px) rotate(-2deg); }
                50% { transform: translate(2px, -0.5px) rotate(1deg); }
              }
              @keyframes hand-right-mold {
                0%, 100% { transform: translate(0px, 0px) rotate(2deg); }
                50% { transform: translate(-2px, 0.5px) rotate(-1deg); }
              }
              @keyframes float-sparkle-1 {
                0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
                50% { opacity: 0.9; }
                100% { transform: translate(24px, -75px) scale(0.9) rotate(45deg); opacity: 0; }
              }
              @keyframes float-sparkle-2 {
                0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
                50% { opacity: 0.9; }
                100% { transform: translate(-20px, -65px) scale(1) rotate(90deg); opacity: 0; }
              }
              @keyframes badge-float-l {
                0%, 100% { transform: translateY(0px) rotate(-3deg); }
                50% { transform: translateY(-6px) rotate(-1.5deg); }
              }
              @keyframes badge-float-r {
                0%, 100% { transform: translateY(0px) rotate(4deg); }
                50% { transform: translateY(-5px) rotate(2.5deg); }
              }
            `}</style>

            {/* LAYER 1: 3D Animated Kids backdrop (Two Collaborative Students!) */}
            <motion.div
              style={{ x: layer1X, y: layer1Y, z: 20 }}
              className="absolute inset-0 flex items-end justify-center pb-12 gap-5 pointer-events-none preserve-3d"
            >
              {/* STUDENT 1: Kid on the Left */}
              <div 
                className="relative w-34 h-56 flex flex-col items-center justify-end pb-3 preserve-3d"
                style={{ animation: "kid-sway-left 5s ease-in-out infinite" }}
              >
                {/* Curly hair background volume */}
                <div className="absolute top-5 w-26 h-26 bg-[#160f09] rounded-full filter blur-[0.5px]" />

                {/* Head */}
                <div 
                  className="relative w-22 h-22 bg-[#f6cb9d] rounded-[30px] shadow-lg flex flex-col items-center justify-center border-2 border-brand-green/80 z-10 preserve-3d"
                  style={{ animation: "head-bob-left 5s ease-in-out infinite", animationDelay: "0.2s" }}
                >
                  {/* Wavy Hair curly top layers */}
                  <div className="absolute -top-2 w-24 h-8 bg-[#160f09] rounded-full" />
                  <div className="absolute -top-3 left-1.5 w-10 h-10 bg-[#160f09] rounded-full" />
                  <div className="absolute -top-2 right-3.5 w-11 h-11 bg-[#160f09] rounded-full" />
                  
                  {/* Soft Ears */}
                  <div className="absolute -left-1.5 top-7 w-2.5 h-4 bg-[#eba471] rounded-l-full border-l-2 border-y-2 border-brand-green/50" />
                  <div className="absolute -right-1.5 top-7 w-2.5 h-4 bg-[#eba471] rounded-r-full border-r-2 border-y-2 border-brand-green/50" />
                  
                  {/* Face */}
                  <div className="relative w-full h-full flex flex-col justify-between p-3 pt-5 preserve-3d">
                    {/* Eyes with blinks */}
                    <div className="flex justify-between px-1.5 mt-0.5">
                      {/* Left Eye */}
                      <div 
                        className="relative w-2.5 h-2.5 bg-[#061543] rounded-full flex items-center justify-center origin-center"
                        style={{ animation: "blink-natural-left 4.5s infinite" }}
                      >
                        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                      </div>
                      {/* Right Eye */}
                      <div 
                        className="relative w-2.5 h-2.5 bg-[#061543] rounded-full flex items-center justify-center origin-center"
                        style={{ animation: "blink-natural-left 4.5s infinite" }}
                      >
                        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Cute clay smudge on the cheek */}
                    <div className="absolute top-[48%] right-2 w-3 h-1.5 bg-[#b95039]/65 rounded-full rotate-[12deg]" />

                    {/* Cute Nose */}
                    <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-[#e09867] rounded-full" />
                    
                    {/* Blushing Cheeks */}
                    <div className="absolute top-[46%] left-2 w-3 h-2.5 rounded-full bg-rose-400/30 filter blur-[0.5px]" />
                    <div className="absolute top-[46%] right-2 w-3 h-2.5 rounded-full bg-rose-400/30 filter blur-[0.5px]" />

                    {/* Satisfied Joyful Smile */}
                    <div className="w-8 h-3 border-b-3 border-[#160f09] rounded-b-full mx-auto mb-1.5" />
                  </div>
                </div>

                {/* Hand-knotted red craft bandana */}
                <div 
                  className="absolute top-10 w-24 h-2.5 bg-[#c86446] rounded-full border border-brand-green z-20 shadow-md transform"
                  style={{ animation: "ribbon-left 4.2s ease-in-out infinite" }}
                />

                {/* Torso & local cotton yellow kurta */}
                <div className="relative w-18 h-20 bg-[#e5b32f] rounded-[20px] border-2 border-brand-green shadow-md flex justify-center pt-1.5 -mt-3 z-0">
                  {/* Neck */}
                  <div className="absolute -top-2.5 w-4.5 h-3.5 bg-[#eba471] border-2 border-brand-green rounded-b-md" />
                  {/* Mud splatters on Kurtas */}
                  <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-[#c86446]/50 rounded-full" />
                  <div className="absolute top-8 right-3.5 w-2 h-1 bg-[#c86446]/60 rounded-full rotate-45" />
                  {/* Small white Rajasthan design shell button */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-95 mt-1 shadow" />
                </div>
              </div>

              {/* STUDENT 2: Kid on the Right */}
              <div 
                className="relative w-34 h-56 flex flex-col items-center justify-end pb-3 preserve-3d"
                style={{ animation: "kid-sway-right 5.5s ease-in-out infinite", animationDelay: "0.4s" }}
              >
                {/* Fluffy hair bun volume backend */}
                <div className="absolute top-5 w-26 h-26 bg-[#52331c] rounded-full filter blur-[0.5px]" />
                <div className="absolute top-1 left-5 w-9 h-9 bg-[#52331c] rounded-full border border-brand-green/30" />
                <div className="absolute top-1 right-5 w-9 h-9 bg-[#52331c] rounded-full border border-brand-green/30" />

                {/* Head */}
                <div 
                  className="relative w-22 h-22 bg-[#fbd4b1] rounded-[30px] shadow-lg flex flex-col items-center justify-center border-2 border-brand-green/80 z-10 preserve-3d"
                  style={{ animation: "head-bob-right 5.5s ease-in-out infinite", animationDelay: "0.6s" }}
                >
                  {/* Hair top elements */}
                  <div className="absolute -top-2 w-24 h-7 bg-[#52331c] rounded-full" />
                  <div className="absolute -top-1.5 left-1.5 w-9 h-9 bg-[#52331c] rounded-full" />
                  <div className="absolute -top-1.5 right-1.5 w-9 h-9 bg-[#52331c] rounded-full" />
                  
                  {/* Soft Ears */}
                  <div className="absolute -left-1.5 top-7 w-2.5 h-4 bg-[#eba471] rounded-l-full border-l-2 border-y-2 border-brand-green/50" />
                  <div className="absolute -right-1.5 top-7 w-2.5 h-4 bg-[#eba471] rounded-r-full border-r-2 border-y-2 border-brand-green/50" />
                  
                  {/* Face */}
                  <div className="relative w-full h-full flex flex-col justify-between p-3 pt-5 preserve-3d">
                    {/* Eyes with blinks */}
                    <div className="flex justify-between px-1.5 mt-0.5">
                      {/* Left Eye */}
                      <div 
                        className="relative w-2.5 h-2.5 bg-[#061543] rounded-full flex items-center justify-center origin-center"
                        style={{ animation: "blink-natural-right 4.1s infinite" }}
                      >
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                      </div>
                      {/* Right Eye */}
                      <div 
                        className="relative w-2.5 h-2.5 bg-[#061543] rounded-full flex items-center justify-center origin-center"
                        style={{ animation: "blink-natural-right 4.1s infinite" }}
                      >
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Cute clay streak on the cheek */}
                    <div className="absolute top-[48%] left-2.5 w-3 h-1.5 bg-[#c86446]/65 rounded-full rotate-[-15deg]" />

                    {/* Cute Nose */}
                    <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-[#e09867] rounded-full" />
                    
                    {/* Blushing Cheeks */}
                    <div className="absolute top-[46%] left-2 w-3 h-2.5 rounded-full bg-rose-400/25 filter blur-[0.5px]" />
                    <div className="absolute top-[46%] right-2 w-3 h-2.5 rounded-full bg-rose-400/25 filter blur-[0.5px]" />

                    {/* Playful Open Smile */}
                    <div className="w-8 h-3.5 bg-[#4c1511] rounded-b-full mx-auto mb-1 flex items-end justify-center overflow-hidden border border-brand-green/45">
                      <div className="w-5 h-2 bg-rose-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Hand-knotted orange craft ribbon */}
                <div 
                  className="absolute top-10 w-24 h-2.5 bg-[#db7e35] rounded-full border border-brand-green z-20 shadow-md transform"
                  style={{ animation: "ribbon-right 4.8s ease-in-out infinite" }}
                />

                {/* Torso & local cotton terracotta/green kurta */}
                <div className="relative w-18 h-20 bg-[#aed9b0] rounded-[20px] border-2 border-brand-green shadow-md flex justify-center pt-1.5 -mt-3 z-0">
                  {/* Neck */}
                  <div className="absolute -top-2.5 w-4.5 h-3.5 bg-[#eba471] border-2 border-brand-green rounded-b-md" />
                  {/* Mud splatters on Kurtas */}
                  <div className="absolute top-5 right-2 w-2 h-1.5 bg-[#ebc360]/50 rounded-full" />
                  <div className="absolute top-7 left-3.5 w-1.5 h-2 bg-[#be583e]/60 rounded-full rotate-[-45deg]" />
                  {/* Small gold shell button */}
                  <div className="w-1 h-1 rounded-full bg-brand-yellow mt-1 shadow" />
                </div>
              </div>
            </motion.div>

            {/* LAYER 2: 3D Pottery Table & Spinning Mud Vase */}
            <motion.div
              style={{ x: layer2X, y: layer2Y, z: 60 }}
              className="absolute inset-x-0 bottom-6 h-36 flex flex-col items-center justify-end pointer-events-none preserve-3d z-30"
            >
              <div 
                className="relative w-64 h-22 bg-brand-sand border-4 border-brand-green rounded-[30px] shadow-[0px_10px_18px_rgba(0,0,0,0.4)] flex items-center justify-center preserve-3d"
                style={{ transform: "rotateX(48deg)" }}
              >
                {/* Rolling stone pottery wheel */}
                <div className="w-34 h-34 rounded-full bg-stone-300 border-2 border-dashed border-stone-500/80 flex items-center justify-center preserve-3d shadow-xl [transform:translateZ(8px)]">
                  <div 
                    className="w-full h-full rounded-full border-6 border-stone-400 border-t-brand-green/45 border-b-brand-green/45 flex items-center justify-center preserve-3d"
                    style={{ animation: "pottery-spin-flat 4s linear infinite" }}
                  >
                    <div className="w-22 h-22 rounded-full border-2 border-dashed border-stone-400/60 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-stone-500/40" />
                    </div>
                  </div>
                </div>

                {/* The clay pot taking form */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 -top-12 w-12 h-18 z-20 preserve-3d origin-bottom"
                  style={{ 
                    transform: "translateX(-50%) translateZ(35px) rotateX(-48deg)",
                    animation: "morph-clay 3.5s ease-in-out infinite"
                  }}
                >
                  <div className="w-full h-full flex flex-col justify-between items-center">
                    {/* Rim */}
                    <div className="w-10 h-3 bg-[#be583e] rounded-full border-2 border-brand-green shadow-inner" />
                    {/* Narrowing Neck */}
                    <div className="w-5.5 h-4 bg-[#c86446] border-x-2 border-brand-green -my-0.5" />
                    {/* Spherical body */}
                    <div className="w-13 h-12 bg-[#c86446] rounded-full border-2 border-[#194025] shadow-md" />
                    {/* Base */}
                    <div className="w-9 h-3 bg-[#ac4a33] rounded-full border-2 border-brand-green" />
                  </div>
                </div>

                {/* Active Math & Trigonometry measurement arc (Learning by Doing) */}
                <svg 
                  className="absolute left-1/2 -translate-x-1/2 -top-16 w-32 h-24 pointer-events-none text-brand-yellow/90 overflow-visible z-20"
                  style={{ transform: "translateZ(38px) rotateX(-48deg)" }}
                  viewBox="0 0 100 80"
                >
                  {/* Dynamic radius vector from turning clay center */}
                  <path d="M 50 68 L 76 48 A 28 28 0 0 0 24 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                  <text x="50" y="32" fill="currentColor" className="font-mono text-[7px] font-extrabold text-center uppercase tracking-wider" textAnchor="middle">R = 12.8cm (θ = 45°)</text>
                  <line x1="50" y1="68" x2="76" y2="48" stroke="currentColor" strokeWidth="1" />
                  <circle cx="76" cy="48" r="2" fill="#e5b32f" />
                </svg>

                {/* Kid's Left Hand moulding */}
                <div 
                  className="absolute -left-1 top-1 w-20 h-14 origin-right"
                  style={{ 
                    transform: "translateZ(25px) rotateX(-48deg)",
                    animation: "hand-left-mold 2.5s ease-in-out infinite"
                  }}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 60 40">
                    <path d="M 4 18 C 12 14, 28 16, 48 14 C 53 15, 53 21, 48 23 C 38 23, 18 25, 4 25 Z" fill="#f6cb9d" stroke="#1b4129" strokeWidth="2" />
                    <circle cx="36" cy="18" r="2.5" fill="#c86446" />
                  </svg>
                </div>

                {/* Kid's Right Hand moulding */}
                <div 
                  className="absolute -right-1 top-1 w-20 h-14 origin-left"
                  style={{ 
                    transform: "translateZ(25px) rotateX(-48deg)",
                    animation: "hand-right-mold 2.5s ease-in-out infinite"
                  }}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 60 40">
                    <path d="M 56 18 C 48 14, 32 16, 12 14 C 7 15, 7 21, 12 23 C 22 23, 42 25, 56 25 Z" fill="#fbd4b1" stroke="#1b4129" strokeWidth="2" />
                    <circle cx="24" cy="19" r="2.5" fill="#c86446" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Floating Sparks particles jumping from active clay */}
            <div 
              className="absolute left-[54%] top-[48%] pointer-events-none z-40 text-brand-yellow"
              style={{ transform: "translateZ(75px)" }}
            >
              <Sparkles className="w-4 h-4 absolute opacity-0" style={{ animation: "float-sparkle-1 2s ease-out infinite" }} />
              <Sparkles className="w-3.5 h-3.5 absolute opacity-0" style={{ animation: "float-sparkle-2 2.6s ease-out infinite", animationDelay: "0.6s" }} />
            </div>

            {/* LAYER 3: Interactive Dialogue Badges floating in 3D */}
            {/* Left Dialogue Bubble */}
            <motion.div
              style={{ x: layer2X, y: layer2Y, z: 90, animation: "badge-float-l 4.2s ease-in-out infinite" }}
              className="absolute top-8 -left-8 lg:-left-12 w-[190px] rounded-2xl bg-white border-2 border-brand-green shadow-[4px_4px_0px_0px_var(--color-brand-green)] p-3.5 z-55 pointer-events-auto"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-brand-clay animate-spin-slow" />
                <h4 className="font-rounded font-extrabold text-[10px] text-brand-green uppercase tracking-wider">Unschooling Heart</h4>
              </div>
              <p className="font-rounded font-bold text-[10.5px] leading-tight text-brand-green">
                "No bells, no uniform. Just child curiosity."
              </p>
            </motion.div>

            {/* Right Badge */}
            <motion.div
              style={{ x: layer3X, y: layer3Y, z: 85, animation: "badge-float-r 3.8s ease-in-out infinite" }}
              className="absolute top-3 -right-6 lg:-right-10 w-[170px] rounded-xl bg-brand-yellow border-2 border-brand-green shadow-[4px_4px_0px_0px_var(--color-brand-green)] p-3 z-50 pointer-events-auto"
            >
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-clay animate-bounce" />
                <h4 className="font-rounded font-extrabold text-[9px] text-brand-green uppercase">Artistry in Clay</h4>
              </div>
              <p className="font-rounded text-[9.5px] leading-normal font-bold text-brand-green/90">
                Centering Rajasthan soil on a manual flywheel teaches geometry through touch.
              </p>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

// Minimal leaf outline SVG to avoid custom assets
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.8 10a7 7 0 0 1-8.8 8Z" />
      <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
    </svg>
  );
}
