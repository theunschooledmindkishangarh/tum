import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Search, 
  Clock, 
  X, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
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

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playingVideo || filteredVideos.length === 0) return;
    const currIdx = filteredVideos.findIndex(vid => vid.id === playingVideo.id);
    const prevIdx = (currIdx - 1 + filteredVideos.length) % filteredVideos.length;
    setPlayingVideo(filteredVideos[prevIdx]);
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playingVideo || filteredVideos.length === 0) return;
    const currIdx = filteredVideos.findIndex(vid => vid.id === playingVideo.id);
    const nextIdx = (currIdx + 1) % filteredVideos.length;
    setPlayingVideo(filteredVideos[nextIdx]);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((vid, index) => {
              const cleanedId = extractYoutubeId(vid.youtubeId || "") || extractYoutubeId(vid.videoUrl || "") || vid.youtubeId || "";
              return (
                <motion.article
                  key={vid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setPlayingVideo({ ...vid, youtubeId: cleanedId })}
                  className="group flex flex-col bg-white border-3 border-brand-green rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-[7px_7px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer h-full"
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
                      <div className="w-12 h-12 rounded-full bg-brand-clay text-white flex items-center justify-center border-2 border-brand-green shadow-lg group-hover:scale-110 group-hover:bg-brand-green transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[9px] font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-brand-yellow" />
                      {vid.duration}
                    </span>

                    {/* Category Label overlay */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-brand-yellow font-rounded font-black text-[8px] uppercase tracking-wider text-brand-green border border-brand-green shadow-[1px_1px_0px_0px_var(--color-brand-green)]">
                      {vid.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-display font-medium text-sm sm:text-base text-brand-green leading-snug group-hover:text-brand-clay transition-colors font-semibold">
                        {vid.title}
                      </h3>
                      <p className="font-rounded font-medium text-[11px] sm:text-xs text-brand-green/60 mt-1.5 line-clamp-3">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

      </div>

      {/* Pop-up Video Player Dialog Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-green/70 backdrop-blur-md flex items-center justify-center p-4 z-90"
            onClick={() => setPlayingVideo(null)}
          >
            {/* Desktop Left navigation buttons */}
            <button
              onClick={(e) => handlePrevVideo(e)}
              className="mr-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white border-4 border-brand-green w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button overlay */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-2.5 rounded-xl bg-brand-clay border-2 border-brand-green text-white hover:scale-105 transition-all shadow-sm cursor-pointer"
                  aria-label="Close Player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* YouTube Player aspect standard player */}
              <div className="relative aspect-video w-full bg-black border-b-2 border-brand-green overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                  title={playingVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Title & Description under Player */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[25vh]">
                <span className="px-2.5 py-1 text-[9px] font-rounded font-black uppercase bg-brand-yellow text-brand-green rounded-md border border-brand-green inline-block mb-3">
                  {playingVideo.category}
                </span>
                <h3 className="font-display font-semibold text-lg md:text-xl text-brand-green leading-snug">
                  {playingVideo.title}
                </h3>
                <p className="font-rounded font-medium text-xs md:text-sm text-brand-green/70 mt-2 leading-relaxed">
                  {playingVideo.description}
                </p>
              </div>

              {/* Mobile next/prev controls in modal footer */}
              <div className="flex border-t border-brand-green/10 justify-between items-center p-3 md:hidden">
                <button
                  onClick={(e) => handlePrevVideo(e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-green text-xs font-rounded font-bold text-brand-green"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={(e) => handleNextVideo(e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-green text-xs font-rounded font-bold text-brand-green"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Desktop Right navigation buttons */}
            <button
              onClick={(e) => handleNextVideo(e)}
              className="ml-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Next Video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
