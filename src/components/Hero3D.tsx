import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sparkles, Compass, Eye, Heart, BookOpen } from "lucide-react";
import studentGirlImg from "../assets/images/student_girl_1779270352412.png";

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

        {/* Right Side: Immersive interactive 3D Animated School Girl Image */}
        <div className="flex items-center justify-center w-full min-h-[450px] md:min-h-[580px]">
          <motion.div
            style={{ rotateX, rotateY }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative w-72 sm:w-85 md:w-[380px] lg:w-[420px] max-w-full aspect-[3/4] cursor-pointer preserve-3d flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Subtle base shadow under the floating image in 3D-space */}
            <div 
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-brand-green/20 rounded-full blur-xl pointer-events-none transition-all duration-500"
              style={{
                transform: isHovered 
                  ? "translateX(-50%) scale(0.95)" 
                  : "translateX(-50%) scale(1)",
                opacity: isHovered ? 0.8 : 0.5
              }}
            />

            {/* The Image Container with organic breathing animations and 3D depth */}
            <div 
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,46,147,0.18)] border-2 border-brand-green/10 bg-brand-sand preserve-3d"
              style={{
                animation: "real-student-sway-breath 6s ease-in-out infinite",
              }}
            >
              <img 
                src={studentGirlImg} 
                alt="Cheerful school girl with backpack, student of The Unschooled Mind"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Ambient vignette gradient inside the image window to give it 3D depth and blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/10 via-transparent to-transparent pointer-events-none mix-blend-multiply" />
              
              {/* Real-time organic light beam reflecting over the frame */}
              <div className="absolute -inset-x-12 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent -skew-y-12 pointer-events-none" />
            </div>

            {/* Simple local keyframe styles for smooth breathing physics */}
            <style>{`
              .preserve-3d {
                transform-style: preserve-3d;
              }
              @keyframes real-student-sway-breath {
                0%, 100% {
                  transform: translateY(0px) rotate(0.5deg) scale(1) translateZ(10px);
                }
                50% {
                  transform: translateY(-8px) rotate(-0.5deg) scale(1.02) translateZ(15px);
                }
              }
            `}</style>
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
