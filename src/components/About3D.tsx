import React, { useState } from "react";
import { motion } from "motion/react";
import { Compass, Sparkles, BookOpen, Heart, Eye, ArrowRight } from "lucide-react";

interface PhilosophyCardProps {
  title: string;
  subTitle: string;
  frontText: string;
  backText: string;
  emoji: string;
  themeColor: string; // "clay", "green", "yellow"
  accentIcon: React.ReactNode;
}

function PhilosophyCard({ title, subTitle, frontText, backText, emoji, themeColor, accentIcon }: PhilosophyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const themeClasses = {
    clay: {
      bgFront: "bg-[#FFF1F2]",
      btnBg: "bg-brand-clay",
      borderColor: "border-brand-clay",
      badgeText: "text-brand-clay bg-brand-clay/10",
    },
    green: {
      bgFront: "bg-[#EEF2FF]",
      btnBg: "bg-brand-green",
      borderColor: "border-brand-green",
      badgeText: "text-brand-green bg-brand-green/10",
    },
    yellow: {
      bgFront: "bg-[#FFFBEB]",
      btnBg: "bg-brand-yellow",
      borderColor: "border-brand-yellow",
      badgeText: "text-brand-yellow bg-brand-yellow/10",
    },
  }[themeColor as "clay" | "green" | "yellow"] || {
    bgFront: "bg-white",
    btnBg: "bg-brand-green",
    borderColor: "border-brand-green",
    badgeText: "text-brand-green bg-brand-green/10",
  };

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative w-full h-[380px] cursor-pointer perspective-1000 group/card"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full h-full relative preserve-3d"
      >
        {/* Front Side */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl border-3 ${themeClasses.borderColor} p-6 flex flex-col justify-between ${themeClasses.bgFront} backface-hidden shadow-[6px_6px_0px_0px_var(--color-brand-green)] group-hover/card:shadow-[8px_8px_0px_0px_var(--color-brand-clay)] group-hover/card:translate-x-[-3px] group-hover/card:translate-y-[-3px] transition-all`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-full uppercase tracking-widest ${themeClasses.badgeText}`}>
                {subTitle}
              </span>
              <div className="text-2xl">{emoji}</div>
            </div>

            <h3 className="font-display font-bold text-2xl text-brand-green leading-snug mb-3">
              {title}
            </h3>

            <p className="font-rounded font-medium text-brand-green/80 text-sm leading-relaxed">
              {frontText}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-brand-green/10 pt-4">
            <span className="font-mono text-[11px] text-brand-green/50 tracking-wider">Tap to inspect</span>
            <div className={`w-8 h-8 rounded-lg ${themeClasses.btnBg} flex items-center justify-center text-white`}>
              {accentIcon}
            </div>
          </div>
        </div>

        {/* Back Side (Rotated initially) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl border-3 border-brand-green p-6 flex flex-col justify-between bg-brand-green text-brand-sand rotate-y-180 backface-hidden shadow-[6px_6px_0px_0px_#ff4d6d]"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="font-mono text-xs font-bold text-brand-yellow uppercase tracking-wider">
                The Practical How
              </span>
              <span className="text-lg">✨</span>
            </div>

            <h4 className="font-display font-semibold text-xl text-brand-sand mb-3">
              {title} (Live Activity)
            </h4>

            <p className="font-rounded text-sm font-medium text-brand-sand/90 leading-relaxed">
              {backText}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="font-mono text-[10px] text-brand-yellow/80">Active engagement model</span>
            <span className="text-xs font-rounded font-bold flex items-center gap-1 text-brand-yellow">
              Go back <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function About3D() {
  const cardsData = [
    {
      title: "Self-Directed Paths",
      subTitle: "Sovereignty First",
      frontText: "We don't force general syllabus streams. Instead, children lead their curriculum based on their daily emerging sparks. When kids decide their learning, it sticks permanently.",
      backText: "A child wants to study aviation? We go outside, build balsa wood drag planes, measure wind shear forces using a digital anemometer, and study global map paths vector trigonometry.",
      emoji: "🧭",
      themeColor: "clay",
      accentIcon: <Compass className="w-4 h-4" />,
    },
    {
      title: "Nature as Primary Lab",
      subTitle: "Experiential Play",
      frontText: "In Kishangarh, we utilize the natural landscape of hills, dry sand mounds, and lakes. We study water systems, flora biology, and local desert microclimates on foot, not from books.",
      backText: "Our natural science consists of tracking local animal species footprint molds, clay soil moisture testing, and constructing organic garden beds that produce real edible greens.",
      emoji: "🌿",
      themeColor: "green",
      accentIcon: <BookOpen className="w-4 h-4" />,
    },
    {
      title: "The Creators Workshop",
      subTitle: "Real Physics & Craft",
      frontText: "We believe hand-coordination drives neuron networks. Our playground has pottery wheels, hammer benches, sewing needles, and oil paints. Children build physical, practical marvels.",
      backText: "Woodwork logic teaches measurement precision, friction, and tool structural safety. Crafting toys out of waste develops systemic resourcefulness, patience, and visual design intuition.",
      emoji: "🎨",
      themeColor: "yellow",
      accentIcon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      {/* Wave element transitioning from sand */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-brand-sand/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Intro Section */}
        <div className="max-w-2xl mx-auto text-center mb-16 flex flex-col items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-clay mb-2 px-3 py-1 rounded-full bg-brand-clay/10 border border-brand-clay/20">
            Our Learning Philosophy
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight mb-4">
            Where Curious Minds Play, Tinker, and Grow Naturally
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm md:text-base leading-relaxed">
            At <strong className="text-brand-green">The Unschooled Mind - Kishangarh</strong>, we break down the four walls of standard classrooms. We encourage children to observe carefully, think independently, and build courageously.
          </p>
        </div>

        {/* 3D Flip Card Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardsData.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <PhilosophyCard {...card} />
            </motion.div>
          ))}
        </div>



      </div>
    </section>
  );
}
