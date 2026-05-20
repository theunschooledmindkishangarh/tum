import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Heart, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Lightbulb, 
  Send, 
  X, 
  MessageSquare, 
  Filter, 
  ArrowRight,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { BlogPost } from "../types";

import natureExplorationImg from "../assets/images/nature_exploration_1779250482557.png";
import studentGirlImg from "../assets/images/student_girl_1779270352412.png";
import cozyReadingImg from "../assets/images/cozy_reading_1779250461671.png";
import outdoorPaintingImg from "../assets/images/outdoor_painting_1779250443852.png";

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Deserts, Carpentry, and Trust: Why We Don't Force Seating",
    category: "Philosophy",
    snippet: "Our philosophy on sitting still, and how letting children choose their workspaces (including outdoor carpentry decks) boosts learning retention to unexpected levels.",
    readTime: "5 min read",
    date: "May 15, 2026",
    author: "Sovereign Guide Vijay",
    image: natureExplorationImg,
    content: "Traditional education measures order by standard parallel desks. At The Unschooled Mind, we measure engagement by active posture. When children are forced to sit mechanically for six hours daily, their primary focus enters muscle defense instead of creative exploration. In our woodshop-to-desert workflow, a child studying angle ratios will stand around a high carpenter workbench, balancing actual logs, checking levels with true gravity bubbles. This physical weight matches mathematical abstraction instantly. We have observed that kids who stand, walk, or crouch while tackling hard projects achieve active mental registration 40% faster than their sitting peers. Giving a child sovereignty over how they sit, move, or work is not an absence of order—it is the direct presence of trust."
  },
  {
    id: "2",
    title: "Whispers of the Clay Wheel: Motor Skills & Mindful Presence",
    category: "Creative Exploration",
    snippet: "Watching a 6-year-old operate a pottery spinner with pure focus reveals the true nature of meditative science. Here is how active crafts teach patience without lecturing.",
    readTime: "4 min read",
    date: "May 10, 2026",
    author: "Pottery Elder Ram",
    image: studentGirlImg,
    content: "If you tell a child to 'be calm' or 'focus,' you are giving them an abstract instruction. If you place a wet, spinning lump of river clay on a manual speed flywheel, you don't need any instructions. In pottery, the clay acts as a biological mirror. If your hand is tense or hurried, the clay shears and collapses. If your posture is steady and slow, the clay rises into an elegant water cup. This is mindful presence taught purely by gravity and friction. Our daily sessions on the clay wheel teach young learners how to control their motor nervous system, regulate deep breathing, and view mistake-events (when the pot collapses) as simple, harmless physical adjustments rather than a grade-card failure. It's a wonderful, messy science of patience."
  },
  {
    id: "3",
    title: "Cozy Corners: Raising Avid Readers Without Syllabus Traps",
    category: "School Life",
    snippet: "Syllabus books often make reading feel like a chore. How does a child transition from ignoring books to requesting extra library hours? We explore child-directed literacy.",
    readTime: "6 min read",
    date: "May 04, 2026",
    author: "Counselor Megha",
    image: cozyReadingImg,
    content: "The easiest way to kill a child's love for reading is to assign standard worksheets and grade reviews after every chapter. In our library vault, we designed small wood-padded floor cavities filled with beanbags, solar-warm reading lamps, and over 1,200 curated books ranging from mechanical rocket diagrams and field botany to classical fantasy tales. We do not test, grade, or inspect reading speeds. Instead, we let children choose their books on absolute impulses. Once a child realizes that literature is a sandbox of ideas rather than a mandatory performance indicator, their native curiosity takes control. They start bringing reading snippets into active council circles, sharing astronomy facts,, or modeling carpentry designs because they *want to know*."
  },
  {
    id: "4",
    title: "The Art of Getting Messy: Outdoor Oils & Desert Wind Play",
    category: "Creative Exploration",
    snippet: "Why traditional indoor tables restrict massive, bold ideas. On a windy afternoon, our learners took their oil panels directly to the sand banks. See what happened when elements joined.",
    readTime: "4 min read",
    date: "April 28, 2026",
    author: "Sovereign Guide Vijay",
    image: outdoorPaintingImg,
    content: "On a gusty desert afternoon, we suspended the indoor painting workshop. Traditional canvas stands restrict broad muscular swings. Instead, we laid out large weatherproof plywood boards directly across the desert dunes. The learners mixed high-density oil paints and used dry grass stems, bird feathers, and bare fingers to splash their impressions. Sand grit got trapped in the wet oil paint, wind currents warped the fluid contours, and leaves stuck directly into the canvases. Instead of scraping them off, the children celebrated this environmental intervention. This taught them that art is an organic dialog between the designer and the natural world, rather than a sterile indoor studio copy. The desert is a massive canvas!"
  }
];

interface Comment {
  author: string;
  text: string;
  date: string;
}

interface PostReactions {
  likes: number;
  dislikes: number;
}

function getNameFromEmail(email: string): string {
  if (!email) return "Visitor";
  if (email.startsWith("🤖")) return email;
  const part = email.split("@")[0];
  return part
    .split(/[\._\-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Reaction State maps postId -> PostReactions
  const [reactions, setReactions] = useState<Record<string, PostReactions>>({});
  // Comment State maps postId -> Comment[]
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  // Auth & Bot Related States
  const [commenterName, setCommenterName] = useState<string>("");
  const [botIsTyping, setBotIsTyping] = useState<Record<string, boolean>>({});

  // Form input variables for comments
  const [commentText, setCommentText] = useState("");
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>({});

  // Categories
  const categories = ["All", "Philosophy", "Creative Exploration", "School Life"];

  // Load from LocalStorage
  useEffect(() => {
    const savedName = localStorage.getItem("workspace_commenter_name") || localStorage.getItem("unschooled_logged_in_email") || "";
    if (savedName) {
      if (savedName.includes("@")) {
        setCommenterName(getNameFromEmail(savedName));
      } else {
        setCommenterName(savedName);
      }
    }

    const savedReactions = localStorage.getItem("unschooled_blog_reactions");
    const savedComments = localStorage.getItem("unschooled_blog_comments");
    const savedBookmarks = localStorage.getItem("unschooled_blog_bookmarks");

    if (savedReactions) {
      try {
        setReactions(JSON.parse(savedReactions));
      } catch (err) {
        console.error("Error loading blog reactions", err);
      }
    } else {
      // Default initial structure - zero counts as requested
      const initialReactions: Record<string, PostReactions> = {};
      INITIAL_BLOG_POSTS.forEach(p => {
        initialReactions[p.id] = { likes: 0, dislikes: 0 };
      });
      setReactions(initialReactions);
    }

    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (err) {
        console.error("Error loading blog comments", err);
      }
    } else {
      // Start blank for live input
      setComments({});
    }

    if (savedBookmarks) {
      try {
        setBookmarkState(JSON.parse(savedBookmarks));
      } catch (err) {
        console.error("Error loading bookmarks", err);
      }
    }
  }, []);

  // Save changes to reaction State
  const saveReactions = (updated: Record<string, PostReactions>) => {
    setReactions(updated);
    localStorage.setItem("unschooled_blog_reactions", JSON.stringify(updated));
  };

  // Save changes to comment State
  const saveComments = (updated: Record<string, Comment[]>) => {
    setComments(updated);
    localStorage.setItem("unschooled_blog_comments", JSON.stringify(updated));
  };

  // Add Reaction
  const handleReaction = (postId: string, type: keyof PostReactions) => {
    const postReactions = reactions[postId] || { likes: 0, dislikes: 0 };
    const updated = {
      ...reactions,
      [postId]: {
        ...postReactions,
        [type]: (postReactions[type] || 0) + 1
      }
    };
    saveReactions(updated);
  };

  // Toggle Bookmark
  const toggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...bookmarkState,
      [postId]: !bookmarkState[postId]
    };
    setBookmarkState(updated);
    localStorage.setItem("unschooled_blog_bookmarks", JSON.stringify(updated));
  };

  // Submit a comment (no login blockade, auto-saving name)
  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const nameToUse = commenterName.trim();
    if (!nameToUse || !commentText.trim()) return;

    localStorage.setItem("workspace_commenter_name", nameToUse);

    const currentPostComments = comments[postId] || [];
    const userText = commentText.trim();
    const newComment: Comment = {
      author: nameToUse,
      text: userText,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };

    const updatedWithUser = {
      ...comments,
      [postId]: [...currentPostComments, newComment]
    };

    saveComments(updatedWithUser);
    setCommentText("");

    // Trigger comment bot thinking indicator
    setBotIsTyping(prev => ({ ...prev, [postId]: true }));

    setTimeout(() => {
      // Re-read latest comments from localStorage to handle multiple edits or state race
      const activeComments = JSON.parse(localStorage.getItem("unschooled_blog_comments") || "{}");
      const updatedPostComments = activeComments[postId] || [];

      // Unified default bot content as requested
      const botResponseText = "Thank you for sharing your thoughts!";

      const botComment: Comment = {
        author: "🤖 The Unschooled Mind",
        text: botResponseText,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      };

      const finalComments = {
        ...activeComments,
        [postId]: [...updatedPostComments, botComment]
      };

      saveComments(finalComments);
      setBotIsTyping(prev => ({ ...prev, [postId]: false }));
    }, 1500);
  };

  // Copy link
  const handleShare = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareSuccess(postId);
    navigator.clipboard?.writeText?.(window.location.href + "#blog-" + postId);
    setTimeout(() => {
      setShareSuccess(null);
    }, 2000);
  };

  // Filtering
  const filteredPosts = INITIAL_BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
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
    setCommentText("");
  };

  const handleNextPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPost || filteredPosts.length === 0) return;
    const currIdx = filteredPosts.findIndex(post => post.id === selectedPost.id);
    const nextIdx = (currIdx + 1) % filteredPosts.length;
    setSelectedPost(filteredPosts[nextIdx]);
    setCommentText("");
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
              <span>Our Blogs</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-brand-green leading-tight">
              The <span className="italic font-normal text-brand-clay">Learning Journal</span>
            </h2>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3">
              Daily logs, educational insights, and organic adventures compiled by our guides, workshop elders, and sovereign children.
            </p>
          </div>

          {/* Search & Categories Combo toolbar */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            {/* Search Input bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search journal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 pl-10 pr-4 py-2.5 bg-white border-2 border-brand-green rounded-xl font-rounded font-bold text-xs text-brand-green focus:outline-none focus:border-brand-clay placeholder:text-brand-green/40 shadow-[2px_2px_0px_0px_var(--color-brand-green)]"
              />
              <Search className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-brand-green/60" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-3.5 top-3 w-4 h-4 text-brand-green/60 hover:text-brand-clay"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl border-2 font-rounded font-bold text-xs transition-all cursor-pointer ${
                activeCategory === cat 
                  ? "bg-brand-green border-brand-green text-brand-sand shadow-[2px_2px_0px_0px_var(--color-brand-clay)] translate-y-[-1px]" 
                  : "bg-white border-brand-green/20 text-brand-green/80 hover:border-brand-green hover:text-brand-green hover:bg-brand-green/5"
              }`}
            >
              {cat}
            </button>
          ))}
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
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
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
          const hasBookmark = bookmarkState[post.id] || false;
          const postCommentsCount = (comments[post.id] || []).length;
          const postReactions = reactions[post.id] || { likes: 0, sparkles: 0, lightbulbs: 0 };

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
                      {/* Metadata line */}
                      <div className="flex items-center gap-4 text-[11px] font-mono font-bold text-brand-green/60 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-clay" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-clay" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

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
                    <div className="pt-4 border-t border-brand-green/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-clay/10 border border-brand-green flex items-center justify-center font-rounded font-bold text-xs text-brand-clay">
                          {post.author[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-rounded font-bold text-xs text-brand-green leading-none">{post.author}</span>
                          <span className="text-[9px] font-mono text-brand-green/50">Guide Coordinator</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Read Button */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-rounded font-extrabold text-brand-clay group-hover:translate-x-1 transition-transform">
                          <span>Read Log</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Tiny reaction counters */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-mono text-brand-green/70">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-brand-clay fill-brand-clay/10" />
                        {postReactions.likes || 0} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="w-3.5 h-3.5 text-brand-green/60" />
                        {postReactions.dislikes || 0} Dislikes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-brand-green" />
                        {postCommentsCount} Comments
                      </span>
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

      </div>

      {/* Blog Overlay / Pop-up Dialog Modal for detailed reading */}
      <AnimatePresence>
        {selectedPost && (() => {
          const postComments = comments[selectedPost.id] || [];
          const postReactions = reactions[selectedPost.id] || { likes: 0, sparkles: 0, lightbulbs: 0 };
          const hasBookmarked = bookmarkState[selectedPost.id] || false;

          return (
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
                  {/* Article Bio Card */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border-2 border-brand-green bg-brand-sand/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-brand-clay text-white flex items-center justify-center font-rounded font-bold shadow-[2px_2px_0px_0px_var(--color-brand-green)]">
                        {selectedPost.author[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-rounded font-bold text-xs text-brand-green leading-none">{selectedPost.author}</span>
                        <span className="text-[10px] font-mono text-brand-green/50">Educational Elder</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs text-brand-green/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-clay" />
                        {selectedPost.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-clay" />
                        {selectedPost.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Actual Detailed Article Body Text */}
                  <div className="font-rounded font-medium text-brand-green/90 leading-relaxed text-sm md:text-base border-b border-brand-green/10 pb-6 whitespace-pre-line">
                    {selectedPost.content}
                  </div>

                  {/* Dynamic Reaction Counters inside modal */}
                  <div>
                    <h4 className="font-rounded font-extrabold text-xs text-brand-green/60 uppercase tracking-widest mb-3.5">
                      Rate this log post
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleReaction(selectedPost.id, "likes")}
                        className="px-4 py-2.5 rounded-xl border-2 border-brand-green bg-white hover:bg-brand-clay/10 text-xs font-rounded font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-0.5 active:shadow-none text-brand-green"
                      >
                        <ThumbsUp className="w-4 h-4 text-brand-clay fill-brand-clay/20" />
                        <span>Like ({postReactions.likes || 0})</span>
                      </button>

                      <button
                        onClick={() => handleReaction(selectedPost.id, "dislikes")}
                        className="px-4 py-2.5 rounded-xl border-2 border-brand-green bg-white hover:bg-brand-clay/10 text-xs font-rounded font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-0.5 active:shadow-none text-brand-green"
                      >
                        <ThumbsDown className="w-4 h-4 text-brand-green/70 fill-brand-green/10" />
                        <span>Dislike ({postReactions.dislikes || 0})</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Comments Drawer */}
                  <div className="pt-4 border-t border-brand-green/10">
                    <h4 className="font-rounded font-extrabold text-sm text-brand-green mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-brand-clay" />
                      <span>Parent Discussions ({postComments.length})</span>
                      <span className="text-[10px] bg-brand-clay/15 text-brand-green/70 px-2.5 py-0.5 rounded-full font-bold ml-auto font-mono">
                        showing latest 5
                      </span>
                    </h4>

                    {/* Comments Feed list */}
                    <div className="flex flex-col gap-3 mb-6">
                      {postComments.length === 0 ? (
                        <p className="text-center font-rounded font-medium text-xs text-brand-green/50 py-4 border border-dashed border-brand-green/20 rounded-xl">
                          Be the first parent to share your feedback or experience with this activity!
                        </p>
                      ) : (
                        postComments.slice(-5).map((comm, cIndex) => (
                          <div 
                            key={cIndex} 
                            className={`border p-4 rounded-xl text-left transition-all ${
                              comm.author.startsWith("🤖") 
                                ? "bg-brand-sand/70 border-brand-green/30 shadow-[3px_3px_0px_0px_rgba(202,103,79,0.1)]" 
                                : "bg-brand-sand/40 border-brand-green/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-rounded font-bold text-xs text-brand-green flex items-center gap-1.5">
                                {comm.author.startsWith("🤖") ? (
                                  <span className="inline-flex items-center gap-1 text-brand-clay">
                                    <span>{comm.author}</span>
                                  </span>
                                ) : (
                                  <span className="text-brand-green font-extrabold text-xs flex flex-wrap items-center gap-1">
                                    <span>{getNameFromEmail(comm.author)}</span>
                                    {comm.author.includes("@") && (
                                      <span className="text-[10px] font-mono font-normal text-brand-green/45">({comm.author})</span>
                                    )}
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] font-mono text-brand-green/50">
                                {comm.date}
                              </span>
                            </div>
                            <p className="font-rounded font-medium text-xs text-brand-green/80 leading-relaxed">
                              {comm.text}
                            </p>
                          </div>
                        ))
                      )}

                      {/* Bot typing simulator */}
                      {botIsTyping[selectedPost.id] && (
                        <div className="bg-brand-sand/20 border border-dashed border-brand-green/30 p-4 rounded-xl text-left flex items-center gap-2 text-xs text-brand-green/60 font-rounded font-bold animate-pulse">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-clay animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-clay animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-clay animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span>The Unschooled Mind is drafting a response...</span>
                        </div>
                      )}
                    </div>

                    {/* Integrated Unified Comment Form (No login hurdle) */}
                    <div className="bg-brand-sand/30 border-2 border-brand-green rounded-2xl p-5 text-left shadow-[2px_2px_0px_0px_var(--color-brand-green)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-rounded font-bold text-xs text-brand-green uppercase tracking-wide">
                          Post Parent Feedback
                        </span>
                      </div>

                      <form onSubmit={(e) => handleAddComment(e, selectedPost.id)} className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Name field */}
                          <div className="w-full sm:w-1/3 flex flex-col">
                            <input
                              type="text"
                              required
                              value={commenterName}
                              onChange={(e) => setCommenterName(e.target.value)}
                              placeholder="Your Name"
                              className="w-full p-3 bg-white border border-brand-green rounded-xl font-rounded font-bold text-xs text-brand-green focus:outline-none focus:border-brand-clay placeholder:text-brand-green/35 text-left"
                            />
                          </div>

                          {/* Message field */}
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              required
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Share your thoughts... (e.g. pottery, carpentry, library, painting)"
                              className="flex-1 p-3 bg-white border border-brand-green rounded-xl font-rounded font-medium text-xs text-brand-green focus:outline-none focus:border-brand-clay placeholder:text-brand-green/35"
                            />
                            <button
                              type="submit"
                              className="px-5 py-3 bg-brand-clay hover:bg-brand-clay/90 text-white rounded-xl border border-brand-green font-rounded font-bold text-xs shadow-[2px_2px_0px_0px_var(--color-brand-green)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-all hover:scale-[1.02] active:translate-y-0.5 active:shadow-none"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
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
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
