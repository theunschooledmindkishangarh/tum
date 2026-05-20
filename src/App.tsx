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
import Footer from "./components/Footer";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track the current location hash to handle custom single-page routing
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

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

  const isAllBlogs = currentHash === "#all-blog-posts";

  return (
    <div className="bg-brand-sand min-h-screen text-brand-green selection:bg-brand-clay selection:text-white relative">
      
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
          <AllBlogsPage />
        ) : (
          /* Standard Parallax Educational Layout */
          <>
            {/* Interactive 3D Parallax Hero */}
            <Hero3D />

            {/* Philosophy Card Flipping Section */}
            <About3D />

            {/* 3D Cylindrical Perspective Active Photo Gallery */}
            <PhotoGallery3D />

            {/* Video Diaries Grid (with embeds) */}
            <VideoGallery />

            {/* Interactive Journal / Blog Section */}
            <BlogSection />

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
