import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Header from "./components/Header";
import Hero3D from "./components/Hero3D";
import About3D from "./components/About3D";
import PhotoGallery3D from "./components/PhotoGallery3D";
import VideoGallery from "./components/VideoGallery";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AllBlogsPage from "./components/AllBlogsPage";
import AllVideosPage from "./components/AllVideosPage";
import Footer from "./components/Footer";
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

  // Centralized Dynamic Content State
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem("custom_site_dynamic_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let hasChanges = false;

        // Automatically migrate old placeholder videos to the fresh 52 YouTube playlist videos,
        // while preserving custom photos or blogs posted through the control panel.
        const hasNewVideos = parsed.videos && parsed.videos.some((v: any) => v.id && v.id.startsWith("yt_"));
        if (!hasNewVideos || parsed.videos.length < 5) {
          parsed.videos = initialDynamicContent.videos;
          hasChanges = true;
        }

        // Clean up old English blogs to present only the new requested Hindi blog post
        const hasOldBlogs = parsed.blogs && parsed.blogs.some((b: any) => b.title && (b.title.includes("Deserts") || b.title.includes("Clay Wheel") || b.title.includes("Avid Readers")));
        const isLatestImage = parsed.blogs && parsed.blogs[0] && parsed.blogs[0].image && parsed.blogs[0].image.includes("1XXv5LJHy45lHHnlhIoioH6x7_Zskh3sv");

        if (hasOldBlogs || !parsed.blogs || parsed.blogs.length !== 1 || (parsed.blogs[0] && parsed.blogs[0].id === "1" && !parsed.blogs[0].title.startsWith("गर्मी की छुट्टियाँ")) || !isLatestImage) {
          parsed.blogs = initialDynamicContent.blogs;
          hasChanges = true;
        }

        if (hasChanges) {
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

  // Automatically fetch, merge, and sync newly uploaded YouTube videos in real-time
  useEffect(() => {
    async function syncYouTubeFeed() {
      const channelId = "UCK5ox28wW9-O3uU6ff2nvpg";
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;

      let feedItems: any[] = [];

      // Try free rss2json endpoint first
      try {
        const res = await fetch(rss2jsonUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === "ok" && Array.isArray(data.items)) {
            feedItems = data.items.map((item: any) => {
              const youtubeId = extractYoutubeId(item.link || item.guid || "") || "";
              return {
                youtubeId,
                title: item.title,
                pubDate: item.pubDate
              };
            });
          }
        }
      } catch (err) {
        console.warn("rss2json API rate-limited or offline, trying back-up CORS parser:", err);
      }

      // Backup failover phase using browser-native DOMParser and corsproxy.io
      if (feedItems.length === 0) {
        try {
          const res = await fetch(corsProxyUrl);
          if (res.ok) {
            const xmlText = await res.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const entries = xmlDoc.getElementsByTagName("entry");
            
            feedItems = [];
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              const titleEl = entry.getElementsByTagName("title")[0];
              const idEl = entry.getElementsByTagName("yt:videoId")[0] || entry.getElementsByTagName("videoId")[0];
              
              let youtubeId = idEl ? idEl.textContent : null;
              if (!youtubeId) {
                const linkEl = entry.getElementsByTagName("link")[0];
                const href = linkEl ? linkEl.getAttribute("href") : "";
                youtubeId = extractYoutubeId(href || "") || "";
              }

              if (youtubeId) {
                feedItems.push({
                  youtubeId,
                  title: titleEl ? titleEl.textContent : "YouTube Video",
                });
              }
            }
          }
        } catch (err) {
          console.error("Backup CORS feed reader failed too:", err);
        }
      }

      if (feedItems.length > 0) {
        setContent((prev: any) => {
          const updated = { ...prev };
          if (!updated.videos) updated.videos = [];

          let hasChanges = false;
          const currentVideoIds = new Set(updated.videos.map((v: any) => v.youtubeId));

          // Run feed item matching in reverse order so newer uploads end up at the very top of our list
          const reversedFeed = [...feedItems].reverse();

          for (const item of reversedFeed) {
            if (item.youtubeId && !currentVideoIds.has(item.youtubeId)) {
              const lowTitle = (item.title || "").toLowerCase();
              
              // Dynamic duration helper
              let duration = "2:30";
              if (lowTitle.includes("short") || lowTitle.includes("masti")) {
                duration = "0:59";
              } else if (lowTitle.includes("cover") || lowTitle.includes("dance")) {
                duration = "2:15";
              }

              // Category classification logic based on title keys
              let category = "Sovereign Mind";
              if (lowTitle.includes("dance") || lowTitle.includes("holi") || lowTitle.includes("cover")) {
                category = "Creative Expression";
              } else if (lowTitle.includes("activity") || lowTitle.includes("planting") || lowTitle.includes("yoga") || lowTitle.includes("sports")) {
                category = "Daily Learning";
              } else if (lowTitle.includes("visit") || lowTitle.includes("airport") || lowTitle.includes("vlog") || lowTitle.includes("assembly")) {
                category = "Active Discoveries";
              }

              const newVideo = {
                id: `yt_${item.youtubeId}`,
                youtubeId: item.youtubeId,
                thumbnailUrl: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`,
                title: item.title || "New Educational Video Diary",
                description: "Live community diary uploaded from our YouTube channel.",
                duration: duration,
                category: category,
                views: "Community Diary"
              };

              updated.videos = [newVideo, ...updated.videos];
              hasChanges = true;
            }
          }

          if (hasChanges) {
            localStorage.setItem("custom_site_dynamic_content", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    }

    syncYouTubeFeed();
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
  const isAllVideos = currentHash === "#all-videos";

  return (
    <div className="bg-brand-sand min-h-screen text-brand-green selection:bg-brand-clay selection:text-white relative pb-16">
      
      {/* 3D Animated Top Scroll Indicator (Only active for home scrolling) */}
      {!isAllBlogs && !isAllVideos && (
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
        ) : isAllVideos ? (
          /* Separate Dedicated All Videos Page */
          <AllVideosPage items={content.videos} />
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

    </div>
  );
}
