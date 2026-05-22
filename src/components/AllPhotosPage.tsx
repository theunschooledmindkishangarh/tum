import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft,
  Camera,
  Minimize2,
  ZoomIn,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { fetchDriveImages, DriveGalleryItem, formatTitle } from "../utils/driveService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function AllPhotosPage() {
  const [images, setImages] = useState<DriveGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Track natural image orientations to dynamically size vertical vs horizontal layouts properly
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number; isVertical: boolean }>>({});

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    let active = true;
    const loadData = async () => {
      try {
        const items = await fetchDriveImages();
        if (active) {
          setImages(items);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loaded images on AllPhotosPage:", err);
        if (active) setLoading(false);
      }
    };
    loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleBackToHome = () => {
    window.location.hash = "#home";
  };

  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions((prev) => ({
      ...prev,
      [id]: {
        width: img.naturalWidth,
        height: img.naturalHeight,
        isVertical: img.naturalHeight > img.naturalWidth
      }
    }));
  };

  // Lightbox loop controls
  const handleLightboxNext = () => {
    if (filteredImages.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
  };

  const handleLightboxPrev = () => {
    if (filteredImages.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
  };

  // Swipe Action Handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; 
    if (diff > swipeThreshold) {
      handleLightboxNext();
    } else if (diff < -swipeThreshold) {
      handleLightboxPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Grid images representation
  const filteredImages = images;

  return (
    <div className="min-h-screen bg-[#FFFDEC]/70 pt-32 pb-24 relative overflow-hidden">
      {/* Aesthetic Ornaments */}
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
              All <span className="italic font-normal text-brand-clay">Moments & Memories</span>
            </h1>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-2">
              Explore dynamic raw snapshots of self-guided studies, community festivals, and our Kishangarh trip logs.
            </p>
          </div>
        </div>



        {loading ? (
          /* Skeletons */
          <div className="min-h-[400px] flex flex-col justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-clay border-t-brand-green rounded-full animate-spin mb-4" />
            <p className="font-rounded font-extrabold text-xs text-brand-green/70">
              Syncing all photo logs...
            </p>
          </div>
        ) : filteredImages.length === 0 ? (
          /* Empty frame */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white border-3 border-brand-green text-center py-20 px-6 rounded-3xl shadow-[5px_5px_0px_0px_var(--color-brand-green)] max-w-xl mx-auto"
          >
            <Camera className="w-12 h-12 text-brand-clay mx-auto mb-4 animate-pulse" />
            <h3 className="font-rounded font-bold text-lg text-brand-green">Shared gallery empty</h3>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-1">Please upload images inside your designated Google Drive folder.</p>
          </motion.div>
        ) : (
          /* The Responsive Images Grid. Note that for mobile we use columns-2 as requested! */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => {
                return (
                  <motion.div
                    key={img.id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setLightboxIndex(index)}
                    className="break-inside-avoid inline-block w-full mb-4 md:mb-6 group bg-white border-2 border-brand-green rounded-xl overflow-hidden shadow-[2.5px_2.5px_0px_0px_var(--color-brand-green)] hover:shadow-[5px_5px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] transition-all cursor-pointer"
                  >
                    {/* Visual segment */}
                    <div className="w-full h-auto overflow-hidden relative">
                      <img
                        src={img.url}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto block select-none"
                        loading="lazy"
                      />
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Swipeable Fullscreen Lightbox Carousel Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-black/98 flex flex-col items-center justify-center select-none"
            onClick={() => setLightboxIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top controls header overlays on top of the screen */}
            <div className="absolute top-4 left-4 right-4 z-60 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-white/85 bg-black/60 backdrop-blur-md px-3 sm:py-2 py-1.5 rounded-xl border border-white/10 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Kishangarh Center ({lightboxIndex + 1} of {filteredImages.length})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(null);
                }}
                className="pointer-events-auto p-2 sm:p-2.5 rounded-xl bg-white text-brand-green hover:bg-brand-clay hover:text-white border-2 border-brand-green shadow-xl transition-all cursor-pointer flex items-center justify-center active:scale-95"
                aria-label="Close Fullscreen View"
              >
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Floating arrow navigation controllers */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxPrev();
              }}
              className="absolute left-3 sm:left-6 p-2.5 sm:p-4 rounded-full border-2 border-brand-green bg-white/95 text-brand-green hover:bg-brand-clay hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-60 shadow-2xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxNext();
              }}
              className="absolute right-3 sm:right-6 p-2.5 sm:p-4 rounded-full border-2 border-brand-green bg-white/95 text-brand-green hover:bg-brand-clay hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer z-60 shadow-2xl"
              aria-label="Next image"
            >
              <ChevronRight className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
            </button>

            {/* Image display container which expands to max aspect heights & widths */}
            <div 
              className="w-full h-full flex items-center justify-center p-3 sm:p-12 md:p-16"
              onClick={() => setLightboxIndex(null)}
            >
              <motion.img
                key={filteredImages[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 26, stiffness: 130 }}
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain pointer-events-none select-none drop-shadow-2xl rounded-sm sm:rounded-md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
