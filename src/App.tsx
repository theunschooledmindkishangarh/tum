import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Shield } from "lucide-react";
import Header from "./components/Header";
import Hero3D from "./components/Hero3D";
import About3D from "./components/About3D";
import PhotoGallery3D from "./components/PhotoGallery3D";
import VideoGallery from "./components/VideoGallery";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AllBlogsPage from "./components/AllBlogsPage";
import Footer from "./components/Footer";
import ControlPanel from "./components/ControlPanel";
import initialDynamicContent from "./data/siteDynamicContent.json";
import { extractYoutubeId } from "./utils/githubService";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track the current location hash to handle custom single-page routing
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  // Is control panel portal open
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // Centralized Dynamic Content State
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem("custom_site_dynamic_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically migrate old placeholder videos to the fresh 52 YouTube playlist videos,
        // while preserving custom photos or blogs posted through the control panel.
        const hasNewVideos = parsed.videos && parsed.videos.some((v: any) => v.id && v.id.startsWith("yt_"));
        if (!hasNewVideos || parsed.videos.length < 5) {
          parsed.videos = initialDynamicContent.videos;
          localStorage.setItem("custom_site_dynamic_content", JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse local stored content: ", e);
      }
    }
    return initialDynamicContent;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Safe frame height adjusters for iFrame compatibility
  useEffect(() => {
    // Scroll to top on startup
    window.scrollTo({ top: 0 });
  }, []);

  const handleContentAdded = (type: "photo" | "video" | "blog", newItem: any) => {
    setContent((prev: any) => {
      const updated = { ...prev };
      
      if (!updated.photos) updated.photos = [];
      if (!updated.videos) updated.videos = [];
      if (!updated.blogs) updated.blogs = [];

      if (type === "photo") {
        updated.photos = [...updated.photos, newItem];
      } else if (type === "video") {
        const vId = extractYoutubeId(newItem.url) || newItem.url;
        const parsedVideo = {
          id: `v_${Date.now()}`,
          youtubeId: vId,
          thumbnailUrl: `https://img.youtube.com/vi/${vId}/hqdefault.jpg`,
          title: newItem.title,
          description: newItem.description || "Video diary added via Control Panel",
          duration: newItem.duration || "5:00",
          category: newItem.category || "Sovereign Mind",
          views: "Just Added"
        };
        updated.videos = [parsedVideo, ...updated.videos];
      } else if (type === "blog") {
        const parsedBlog = {
          id: `blog_${Date.now()}`,
          title: newItem.title,
          category: newItem.category || "Philosophy",
          snippet: newItem.content.substring(0, 150) + "...",
          readTime: `${Math.ceil(newItem.content.split(/\s+/).length / 200)} min read`,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          }),
          author: newItem.author || "Admin Guide",
          image: newItem.image,
          content: newItem.content
        };
        updated.blogs = [parsedBlog, ...updated.blogs];
      }
      
      localStorage.setItem("custom_site_dynamic_content", JSON.stringify(updated));
      return updated;
    });
  };

  const isAllBlogs = currentHash === "#all-blog-posts";

  return (
    <div className="bg-brand-sand min-h-screen text-brand-green selection:bg-brand-clay selection:text-white relative pb-16">
      
      {/* 3D Animated Top Scroll Indicator (Only active for home scrolling) */}
      {!isAllBlogs && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-brand-clay origin-left z-55"
          style={{ scaleX }}
        />
      )}

      {/* Primary Top Header Navigation */}
      <Header />

      <main className="relative overflow-x-hidden">
        {isAllBlogs ? (
          /* Separate Dedicated All Blog Posts Page */
          <AllBlogsPage items={content.blogs} />
        ) : (
          /* Standard Parallax Educational Layout */
          <>
            {/* Interactive 3D Parallax Hero */}
            <Hero3D />

            {/* Philosophy Card Flipping Section */}
            <About3D />

            {/* 3D Cylindrical Perspective Active Photo Gallery */}
            <PhotoGallery3D items={content.photos} />

            {/* Video Diaries Grid (with embeds) */}
            <VideoGallery items={content.videos} />

            {/* Interactive Journal / Blog Section */}
            <BlogSection items={content.blogs} />

            {/* Location Maps & Contact numbers */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Cohesive Legal & Social Footer */}
      <Footer />

      {/* Discreet floating Administrative Portal Action Button */}
      <div className="fixed bottom-6 right-6 z-90">
        <motion.button
          onClick={() => setIsPortalOpen(true)}
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="p-3.5 bg-brand-clay hover:bg-brand-green border-2 border-brand-green text-white rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-none translate-x-0 hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group"
          title="Makerspace Portal"
        >
          <Shield className="w-5 h-5 text-brand-yellow group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out font-rounded font-extrabold text-xs whitespace-nowrap group-hover:ml-2 text-brand-sand">
            Makerspace Portal
          </span>
        </motion.button>
      </div>

      {/* Makerspace Control Panel Portal Overlay Form */}
      <ControlPanel 
        isOpen={isPortalOpen} 
        onClose={() => setIsPortalOpen(false)} 
        onContentAdded={handleContentAdded}
      />

    </div>
  );
}
