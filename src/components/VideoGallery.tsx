import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Tv, Youtube, BookOpen, Clock, Users, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { extractYoutubeId } from "../utils/githubService";

interface VideoGalleryProps {
  items?: Array<{
    id: string;
    youtubeId?: string;
    videoUrl?: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    views?: string;
  }>;
}

export default function VideoGallery({ items }: VideoGalleryProps) {
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const videos = (items && items.length > 0)
    ? items
    : [
        {
          id: "v1",
          youtubeId: "iG9CE55wbtY",
          thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
          title: "Do schools kill creativity?",
          description: "Sir Ken Robinson's classic, inspiring call for a school system that nurtures children's natural creative sparks rather than standard compliance.",
          duration: "19:12",
          category: "Sovereign Mind",
          views: "22 Million+"
        },
        {
          id: "v2",
          youtubeId: "dk60sYrU2RU",
          thumbnailUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
          title: "The 'Hole in the Wall' Experiment",
          description: "Sugata Mitra's groundbreaking research proving that groups of children can teach themselves almost anything using a computer on a wall, with zero coercion.",
          duration: "17:10",
          category: "Self-Learning",
          views: "4.5 Million+"
        },
        {
          id: "v3",
          youtubeId: "vBBeWn7e274",
          thumbnailUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
          title: "Philosophy of Experiential Crafting",
          description: "How working with raw sand, carpentry tools, and garden soil fires neural networks in early childhood, building deep thinking traits.",
          duration: "12:45",
          category: "Makerspace Bio",
          views: "Curated"
        }
      ];

  const [selectedCategory, setSelectedCategory] = useState("Creative Expression");

  const categories = ["Creative Expression", "Active Discoveries", "Daily Learning", "Sovereign Mind"];

  const filteredVideos = videos.filter((v) => v.category === selectedCategory) || videos;

  // Make sure we clamp index safely inside the filtered range
  const clampedIndex = activeIndex >= filteredVideos.length ? 0 : activeIndex;
  const rawCurrentVid = filteredVideos[clampedIndex] || filteredVideos[0];
  
  // Clean or extract YouTube ID on the fly to prevent full URLs or invalid strings from breaking the player
  const cleanYoutubeId = rawCurrentVid
    ? (extractYoutubeId(rawCurrentVid.youtubeId || "") || extractYoutubeId(rawCurrentVid.videoUrl || "") || rawCurrentVid.youtubeId || "")
    : "";
    
  const currentVid = rawCurrentVid
    ? { ...rawCurrentVid, youtubeId: cleanYoutubeId }
    : { id: "empty", title: "", description: "", category: "", duration: "", youtubeId: "", thumbnailUrl: "" };

  const isPlaying = activePlayId === currentVid.id;

  const handlePrev = () => {
    setActivePlayId(null);
    setActiveIndex((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const handleNext = () => {
    setActivePlayId(null);
    setActiveIndex((prev) => (prev + 1) % filteredVideos.length);
  };

  const handleCategoryChange = (cat: string) => {
    setActivePlayId(null);
    setSelectedCategory(cat);
    setActiveIndex(0);
  };

  return (
    <section id="videos" className="py-24 bg-white relative">
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-10 flex flex-col items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-clay px-3 py-1 rounded-full bg-brand-clay/10 border border-brand-clay/20 w-fit inline-block mb-3">
            Video Diaries
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight">
            Curious Minds on <span className="italic font-normal text-brand-clay">Motion Film</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3 leading-relaxed">
            Watch our direct learning logs, rustic dance covers, pottery workshops, and outdoor trips filmed live from our active learning sanctuary in Kishangarh, Rajasthan.
          </p>
        </div>

        {/* Categories horizontal filter block */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto px-4">
          {categories.map((cat) => {
            const count = cat === "All" ? videos.length : videos.filter(v => v.category === cat).length;
            if (count === 0 && cat !== "All") return null;
            
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs font-rounded font-bold rounded-xl border-2 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-clay border-brand-green text-white shadow-[2px_2px_0px_0px_var(--color-brand-green)]"
                    : "bg-brand-sand/20 border-brand-green/15 text-brand-green hover:bg-brand-sand/50 hover:border-brand-green/45"
                }`}
              >
                {cat} <span className="opacity-60 text-[10px] font-mono ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Single Video Card Slider */}
        <div className="max-w-xl mx-auto relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVid.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col bg-brand-sand/30 border-3 border-brand-green rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-[6px_6px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              {/* Media Screen Container */}
              <div className="relative aspect-video w-full bg-black border-b-2 border-brand-green overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isPlaying ? (
                    <motion.div
                      key="thumbnail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full cursor-pointer"
                      onClick={() => setActivePlayId(currentVid.id)}
                    >
                      <img
                        src={currentVid.thumbnailUrl}
                        alt={currentVid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-brand-green/20 mix-blend-multiply transition-opacity group-hover:opacity-40" />
                      
                      {/* Center Hover Play Circle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-brand-clay text-white flex items-center justify-center border-2 border-brand-green shadow-lg group-hover:scale-110 group-hover:bg-brand-green transition-all">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                      </div>

                      {/* Badges Overlays */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white border border-brand-green text-[9px] font-mono tracking-widest font-bold text-brand-green uppercase">
                        {currentVid.category}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-yellow" />
                        {currentVid.duration}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${currentVid.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                        title={currentVid.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Content Box */}
              <div 
                onClick={() => setActivePlayId(isPlaying ? null : currentVid.id)}
                className="p-5 flex flex-col justify-center text-left cursor-pointer"
              >
                <h3 className="font-display font-medium text-[15px] sm:text-base text-brand-green leading-snug group-hover:text-brand-clay transition-colors font-semibold">
                  {currentVid.title}
                </h3>
                <p className="font-rounded font-medium text-[11px] sm:text-xs text-brand-green/60 mt-1.5 line-clamp-2">
                  {currentVid.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Navigation Controls */}
          {filteredVideos.length > 1 && (
            <>
              <div className="absolute top-1/2 -left-3 md:-left-16 transform -translate-y-1/2 z-10 flex">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                  aria-label="Previous Video"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute top-1/2 -right-3 md:-right-16 transform -translate-y-1/2 z-10 flex">
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                  aria-label="Next Video"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Indicators / Progress Dot bar or Compact Counter bar */}
          <div className="flex flex-col items-center gap-2 mt-6">
            <span className="font-mono text-xs font-bold text-brand-green/60">
              {clampedIndex + 1} of {filteredVideos.length} Video{filteredVideos.length > 1 ? "s" : ""}
            </span>
            {filteredVideos.length <= 8 ? (
              <div className="flex justify-center items-center gap-2">
                {filteredVideos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePlayId(null);
                      setActiveIndex(i);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      clampedIndex === i ? "w-8 bg-brand-clay" : "w-2.5 bg-brand-green/30"
                    }`}
                    aria-label={`Go to video ${i + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-1.5">
                <div className="w-32 h-1 bg-brand-green/15 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-brand-clay transition-all duration-300 rounded-full" 
                    style={{ width: `${((clampedIndex + 1) / filteredVideos.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* All Videos trigger button below indicators */}
            <div className="mt-4">
              <button
                onClick={() => {
                  window.location.hash = "#all-videos";
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-clay hover:bg-brand-green border-2 border-brand-green text-white font-rounded font-extrabold text-xs rounded-xl shadow-[3px_3px_0px_0px_var(--color-brand-green)] hover:shadow-none translate-x-[0px] translate-y-[0px] hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all cursor-pointer group"
              >
                <Tv className="w-4 h-4 group-hover:rotate-6 transition-transform text-brand-yellow" />
                <span>All Videos ({videos.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Youtube Channel Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-brand-sand/50 border-3 border-brand-clay rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-clay flex items-center justify-center text-white border-2 border-brand-green">
              <Youtube className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-display font-medium text-lg text-brand-green leading-tight">
                Want to watch school vlog diaries?
              </h4>
              <p className="font-rounded font-medium text-xs text-brand-green/70 mt-1">
                Subscribing helps you stay updated with daily outdoor trips and pottery lessons from Kishangarh, Rajasthan.
              </p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/@theunschooledmindkishangarh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-brand-clay border-2 border-brand-green font-rounded font-bold text-xs text-white shadow-[3px_3px_0px_0px_var(--color-brand-green)] hover:bg-brand-clay/90 hover:translate-y-[-1px] transition-all"
          >
            Visit YouTube Channel
          </a>
        </motion.div>

      </div>
    </section>
  );
}
