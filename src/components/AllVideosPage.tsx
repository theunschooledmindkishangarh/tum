import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Search, 
  Clock, 
  X, 
  ArrowLeft,
  Play
} from "lucide-react";
import { VideoItem } from "../types";
import { extractYoutubeId } from "../utils/githubService";

interface AllVideosPageProps {
  items?: VideoItem[];
}

export default function AllVideosPage({ items }: AllVideosPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const handlePlayVideo = (vid: VideoItem, cleanedId: string) => {
    setPlayingVideo({ ...vid, youtubeId: cleanedId });
    if (playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    }
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const videos = items || [];

  const categories = ["All", "Creative Expression", "Active Discoveries", "Daily Learning", "Sovereign Mind"];

  // Filtering
  const filteredVideos = videos.filter(vid => {
    const matchesSearch = vid.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vid.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || vid.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToHome = () => {
    window.location.hash = "#home";
  };

  return (
    <div className="min-h-screen bg-[#FFFDEC]/70 pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-12 left-10 w-24 h-24 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-32 h-32 bg-brand-clay/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Back and Page Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b-2 border-brand-green/10 pb-8">
          <div>
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-xl border-2 border-brand-green bg-white text-brand-green font-rounded font-bold text-xs shadow-[2px_2px_0px_0px_var(--color-brand-green)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-clay" />
              <span>Back to Home</span>
            </button>
            <h1 className="font-display font-bold text-4xl text-brand-green leading-tight">
              All <span className="italic font-normal text-brand-clay">Video Diaries</span>
            </h1>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-2">
              Browse, play, and explore our full collection of active learning journals and school trips.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search all videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-brand-green rounded-xl font-rounded font-bold text-xs text-brand-green focus:outline-none focus:border-brand-clay placeholder:text-brand-green/45 shadow-[2px_2px_0px_0px_var(--color-brand-green)]"
            />
            <Search className="absolute left-3.5 top-4 w-3.5 h-3.5 text-brand-green/60" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute right-3.5 top-3.5 w-4 h-4 text-brand-green/60 hover:text-brand-clay"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center justify-start gap-2 mb-10 max-w-4xl">
          {categories.map((cat) => {
            const count = cat === "All" ? videos.length : videos.filter(v => v.category === cat).length;
            if (count === 0 && cat !== "All") return null;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-rounded font-bold rounded-xl border-2 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-clay border-brand-green text-white shadow-[2px_2px_0px_0px_var(--color-brand-green)]"
                    : "bg-white border-brand-green/15 text-brand-green hover:bg-white hover:border-brand-green/45"
                }`}
              >
                {cat} <span className="opacity-60 text-[10px] font-mono ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white border-3 border-brand-green text-center py-20 px-6 rounded-3xl shadow-[5px_5px_0px_0px_var(--color-brand-green)] max-w-xl mx-auto"
          >
            <Tv className="w-12 h-12 text-brand-clay mx-auto mb-4 animate-pulse" />
            <h3 className="font-rounded font-bold text-lg text-brand-green">No videos found</h3>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-1">Try resetting the filters or look for other keywords.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-5 py-2.5 bg-brand-clay text-white rounded-xl border-2 border-brand-green font-rounded font-bold text-xs shadow-[3px_3px_0px_0px_var(--color-brand-green)] cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Video grid */}
        {filteredVideos.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {filteredVideos.map((vid, index) => {
              const cleanedId = extractYoutubeId(vid.youtubeId || "") || extractYoutubeId(vid.videoUrl || "") || vid.youtubeId || "";
              return (
                <motion.article
                  key={vid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handlePlayVideo(vid, cleanedId)}
                  className="group flex flex-col bg-white border-2 sm:border-3 border-brand-green rounded-xl sm:rounded-2xl overflow-hidden shadow-[2.5px_2.5px_0px_0px_var(--color-brand-green)] sm:shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-[4px_4px_0px_0px_var(--color-brand-clay)] sm:hover:shadow-[7px_7px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-1px] sm:hover:translate-x-[-2px] hover:translate-y-[-1px] sm:hover:translate-y-[-2px] transition-all cursor-pointer h-full"
                >
                  {/* Thumbnail / Play Button area */}
                  <div className="relative aspect-[16/10] w-full bg-brand-green/5 overflow-hidden border-b-2 border-brand-green">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-brand-green/10 mix-blend-multiply transition-opacity group-hover:opacity-30" />
                    
                    {/* Hover Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-clay text-white flex items-center justify-center border-2 border-brand-green shadow-sm sm:shadow-lg group-hover:scale-110 group-hover:bg-brand-green transition-all">
                        <Play className="w-3 h-3 sm:w-5 sm:h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-1 sm:px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-brand-yellow" />
                      {vid.duration}
                    </span>

                    {/* Category Label overlay */}
                    <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded bg-brand-yellow font-rounded font-black text-[7px] sm:text-[8px] uppercase tracking-wider text-brand-green border border-brand-green shadow-[1px_1px_0px_0px_var(--color-brand-green)]">
                      {vid.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-display text-xs sm:text-base text-brand-green leading-snug group-hover:text-brand-clay transition-colors font-semibold line-clamp-2">
                        {vid.title}
                      </h3>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

      </div>

      {/* Immersive Video Player Dialog Modal */}
      <div 
        ref={playerContainerRef}
        className={`fixed inset-0 bg-black flex items-center justify-center z-90 transition-all duration-300 ${
          playingVideo ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setPlayingVideo(null);
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
          }
        }}
      >
        {playingVideo && (
          <div className="relative w-screen h-screen bg-black flex items-center justify-center">
            {/* Immersive YouTube Player spanning full size */}
            <iframe
              src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&autoplay=1`}
              title={playingVideo.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Immersive Floating Close Button */}
            <button
              onClick={() => {
                setPlayingVideo(null);
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(err => console.log(err));
                }
              }}
              className="absolute top-6 right-6 z-100 p-3 rounded-full bg-black/60 hover:bg-brand-clay border border-white/30 text-white transition-all hover:scale-110 cursor-pointer shadow-2xl"
              aria-label="Close Player"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
