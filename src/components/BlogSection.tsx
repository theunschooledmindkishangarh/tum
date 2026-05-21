import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  X, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { BlogPost } from "../types";
import { INITIAL_BLOG_POSTS } from "../data/blogData";
import { resolveAssetUrl } from "../utils/resolveAsset";

interface BlogSectionProps {
  items?: BlogPost[];
}

export default function BlogSection({ items }: BlogSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Blog Posts");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Categories
  const categories = ["All Blog Posts"];

  const rawPosts = (items && items.length > 0) ? items : INITIAL_BLOG_POSTS;
  const processedPosts = rawPosts.map(post => ({
    ...post,
    image: resolveAssetUrl(post.image)
  }));

  // Filtering
  const filteredPosts = processedPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || activeCategory === "All Blog Posts";
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [activeBlogIndex, setActiveBlogIndex] = useState(0);

  useEffect(() => {
    setActiveBlogIndex(0);
  }, [activeCategory, searchTerm]);

  const handleMainPrev = () => {
    if (filteredPosts.length <= 1) return;
    setActiveBlogIndex((prev) => (prev - 1 + filteredPosts.length) % filteredPosts.length);
  };

  const handleMainNext = () => {
    if (filteredPosts.length <= 1) return;
    setActiveBlogIndex((prev) => (prev + 1) % filteredPosts.length);
  };

  const handlePrevPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPost || filteredPosts.length === 0) return;
    const currIdx = filteredPosts.findIndex(post => post.id === selectedPost.id);
    const prevIdx = (currIdx - 1 + filteredPosts.length) % filteredPosts.length;
    setSelectedPost(filteredPosts[prevIdx]);
  };

  const handleNextPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPost || filteredPosts.length === 0) return;
    const currIdx = filteredPosts.findIndex(post => post.id === selectedPost.id);
    const nextIdx = (currIdx + 1) % filteredPosts.length;
    setSelectedPost(filteredPosts[nextIdx]);
  };

  const handleRedirectToAll = () => {
    window.location.hash = "#all-blog-posts";
  };

  return (
    <section id="blog" className="py-24 bg-[#FFFDEC]/60 relative border-t-3 border-brand-green overflow-hidden">
      {/* Decorative Natural Ornaments */}
      <div className="absolute top-12 left-10 w-24 h-24 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-32 h-32 bg-brand-clay/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-[0.03]" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-clay/10 border border-brand-clay/20 font-rounded font-bold text-[10px] text-brand-clay uppercase tracking-widest mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Our Journal</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-brand-green leading-tight">
              The <span className="italic font-normal text-brand-clay">Learning Journal</span>
            </h2>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3">
              Daily logs, educational insights, and organic adventures compiled by our guides, workshop elders, and sovereign children.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white border-3 border-brand-green text-center py-16 px-6 rounded-3xl shadow-[5px_5px_0px_0px_var(--color-brand-green)]"
          >
            <BookOpen className="w-12 h-12 text-brand-clay mx-auto mb-4 animate-pulse" />
            <h3 className="font-rounded font-bold text-lg text-brand-green">No logs found matching your query</h3>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-1">Try resetting the filters or look for other educational topics.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("All Blog Posts"); }}
              className="mt-5 px-5 py-2.5 bg-brand-clay text-white rounded-xl border-2 border-brand-green font-rounded font-bold text-xs shadow-[3px_3px_0px_0px_var(--color-brand-green)] cursor-pointer"
            >
              Reset Search & Category
            </button>
          </motion.div>
        )}

        {/* Blog Post Single Card Slider */}
        {filteredPosts.length > 0 && (() => {
          const safeIndex = activeBlogIndex % filteredPosts.length;
          const post = filteredPosts[safeIndex];

          return (
            <div className="max-w-2xl mx-auto relative px-4">
              <AnimatePresence mode="wait">
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPost(post)}
                  className="group flex flex-col bg-white border-3 border-brand-green rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_var(--color-brand-green)] hover:shadow-[8px_8px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all cursor-pointer"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] w-full bg-brand-green/5 overflow-hidden border-b-2 border-brand-green">
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category Pill Overlays */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-brand-yellow font-rounded font-black text-[9px] uppercase tracking-wider text-brand-green border border-brand-green shadow-[1.5px_1.5px_0px_0px_var(--color-brand-green)]">
                      {post.category}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                    <div>
                      {/* Blog Title */}
                      <h3 className="font-display font-bold text-2xl text-brand-green mb-3 group-hover:text-brand-clay transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Snippet text */}
                      <p className="font-rounded font-medium text-brand-green/85 text-xs md:text-sm mb-6 leading-relaxed">
                        {post.snippet}
                      </p>
                    </div>

                    {/* Footer metadata details */}
                    <div className="pt-4 border-t border-brand-green/10 flex items-center justify-end">
                      <div className="flex items-center gap-3">
                        {/* Read Button */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-rounded font-extrabold text-brand-clay group-hover:translate-x-1 transition-transform">
                          <span>Read Log</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              {/* Left Navigation Control Arrow */}
              {filteredPosts.length > 1 && (
                <div className="absolute top-1/2 -left-3 md:-left-16 transform -translate-y-1/2 z-10 flex">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMainPrev(); }}
                    className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                    aria-label="Previous Post"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Right Navigation Control Arrow */}
              {filteredPosts.length > 1 && (
                <div className="absolute top-1/2 -right-3 md:-right-16 transform -translate-y-1/2 z-10 flex">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMainNext(); }}
                    className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                    aria-label="Next Post"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Progress Dot bar */}
              {filteredPosts.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  {filteredPosts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBlogIndex(i)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        safeIndex === i ? "w-8 bg-brand-clay" : "w-2.5 bg-brand-green/30"
                      }`}
                      aria-label={`Go to post ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Dedicated All Blog Posts Button located below the blog post slider */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleRedirectToAll}
            className="px-6 py-3 bg-brand-green text-white rounded-xl border-2 border-brand-green font-rounded font-extrabold text-xs shadow-[3px_3px_0px_0px_var(--color-brand-clay)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 active:shadow-none text-center"
          >
            All Blog Posts ➔
          </button>
        </div>

      </div>

      {/* Blog Overlay / Pop-up Dialog Modal for detailed reading */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-green/50 backdrop-blur-md flex items-center justify-center p-4 z-90 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            {/* Desktop Left Navigation Button */}
            <button
              onClick={(e) => handlePrevPost(e)}
              className="mr-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Previous Log"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white border-4 border-brand-green w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[88vh] flex flex-col shadow-brand-green/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Actions bar */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2.5 rounded-xl bg-brand-clay border-2 border-brand-green text-white hover:scale-105 transition-all shadow-sm cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cover Image in background */}
              <div className="relative h-60 w-full min-h-[220px] shrink-0 border-b-2 border-brand-green">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent flex items-end p-6">
                  <div>
                    <span className="px-3 py-1 text-[10px] font-rounded font-black uppercase bg-brand-yellow text-brand-green rounded-md border border-brand-green mr-2">
                      {selectedPost.category}
                    </span>
                    <h3 className="font-display font-semibold text-xl md:text-2xl text-brand-sand mt-2 max-w-xl leading-snug">
                      {selectedPost.title}
                    </h3>
                  </div>
                </div>

                {/* Mobile Left Floater Button */}
                <div className="absolute inset-y-0 left-2 flex items-center z-10">
                  <button
                    onClick={(e) => handlePrevPost(e)}
                    className="p-2 md:hidden rounded-full bg-white/90 border border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                    aria-label="Previous Post"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Right Floater Button */}
                <div className="absolute inset-y-0 right-2 flex items-center z-10">
                  <button
                    onClick={(e) => handleNextPost(e)}
                    className="p-2 md:hidden rounded-full bg-white/90 border border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                    aria-label="Next Post"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sticky Detail Content / Scrollable Content container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                {/* Actual Detailed Article Body Text */}
                <div className="font-rounded font-medium text-brand-green/95 leading-relaxed text-sm md:text-base whitespace-pre-line pb-4">
                  {selectedPost.content}
                </div>
              </div>
            </motion.div>

            {/* Desktop Right Navigation Button */}
            <button
              onClick={(e) => handleNextPost(e)}
              className="ml-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Next Log"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
