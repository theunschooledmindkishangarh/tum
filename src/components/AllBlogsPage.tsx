import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  X, 
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { BlogPost } from "../types";
import { INITIAL_BLOG_POSTS } from "../data/blogData";
import { resolveAssetUrl } from "../utils/resolveAsset";

interface AllBlogsPageProps {
  items?: BlogPost[];
}

export default function AllBlogsPage({ items }: AllBlogsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const rawPosts = (items && items.length > 0) ? items : INITIAL_BLOG_POSTS;
  const processedPosts = rawPosts.map(post => ({
    ...post,
    image: resolveAssetUrl(post.image)
  }));

  // Filtering
  const filteredPosts = processedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  const handleBackToHome = () => {
    window.location.hash = "#home";
  };

  return (
    <div className="min-h-screen bg-[#FFFDEC]/70 pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Natural Ornaments */}
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
              All <span className="italic font-normal text-brand-clay">Blog Posts</span>
            </h1>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-2">
              Browse through our entire collection of deep-dive logs, experiential discoveries, and guide reflections.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search all posts..."
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

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white border-3 border-brand-green text-center py-20 px-6 rounded-3xl shadow-[5px_5px_0px_0px_var(--color-brand-green)] max-w-xl mx-auto"
          >
            <BookOpen className="w-12 h-12 text-brand-clay mx-auto mb-4 animate-pulse" />
            <h3 className="font-rounded font-bold text-lg text-brand-green">No blog posts found</h3>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-1">Try resetting the filters or look for other keywords.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-6 px-5 py-2.5 bg-brand-clay text-white rounded-xl border-2 border-brand-green font-rounded font-bold text-xs shadow-[3px_3px_0px_0px_var(--color-brand-green)] cursor-pointer"
            >
              Reset Search Filter
            </button>
          </motion.div>
        )}

        {/* Blog Post grid */}
        {filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className="group flex flex-col bg-white border-3 border-brand-green rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-[7px_7px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer h-full"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-brand-green/5 overflow-hidden border-b-2 border-brand-green">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-green mb-3 group-hover:text-brand-clay transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="font-rounded font-medium text-brand-green/80 text-xs leading-relaxed mb-6">
                      {post.snippet}
                    </p>
                  </div>

                  {/* Card footer details */}
                  <div className="pt-4 border-t border-brand-green/10 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-[10px] font-rounded font-extrabold text-brand-clay group-hover:translate-x-0.5 transition-transform">
                      <span>Read Log</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* Pop-up Dialog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-green/50 backdrop-blur-md flex items-center justify-center p-4 z-90 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            {/* Desktop Navigation buttons */}
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
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2.5 rounded-xl bg-brand-clay border-2 border-brand-green text-white hover:scale-105 transition-all shadow-sm cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cover Image */}
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

                {/* Mobile left/right indicators */}
                <div className="absolute inset-y-0 left-2 flex items-center z-10">
                  <button
                    onClick={(e) => handlePrevPost(e)}
                    className="p-2 md:hidden rounded-full bg-white/90 border border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                    aria-label="Previous Post"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
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

              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                <div className="font-rounded font-medium text-brand-green/95 leading-relaxed text-sm md:text-base whitespace-pre-line pb-4">
                  {selectedPost.content}
                </div>
              </div>
            </motion.div>

            {/* Desktop right clicker button */}
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
    </div>
  );
}
