import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Minimize2, 
  ZoomIn, 
  MapPin, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { fetchDriveImages, DriveGalleryItem, formatTitle } from "../utils/driveService";

export default function DynamicDriveGallery() {
  const [images, setImages] = useState<DriveGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto sync on mount
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const items = await fetchDriveImages();
        if (active) {
          setImages(items);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loaded images:", err);
        if (active) setLoading(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Lightbox index pagination
  const handleLightboxNext = () => {
    if (images.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % images.length);
  };

  const handleLightboxPrev = () => {
    if (images.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length);
  };

  // Touch Swipe Gesture Detection for full screen mode
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
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // trigger swipe above 50px
    if (diffX > threshold) {
      handleLightboxNext(); // Swiped left -> display next
    } else if (diffX < -threshold) {
      handleLightboxPrev(); // Swiped right -> display previous
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentImg = images[currentIndex];

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-brand-sand/40 relative overflow-hidden">
      {/* Aesthetic Organics */}
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-[0.04]" />
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-brand-yellow/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-brand-clay/10 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Title Bar Header */}
        <div className="mb-10 flex flex-col items-center">
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-clay px-3.5 py-1.5 rounded-full bg-brand-clay/15 border border-brand-clay/20 w-fit inline-flex items-center gap-1.5 mb-4">
            <Camera className="w-3.5 h-3.5" />
            Live Syncing Gallery
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight">
            Life Inside <span className="italic font-normal text-brand-clay">"The Unschooled Mind"</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/75 text-sm max-w-xl mt-3 leading-relaxed">
            Spontaneous moments of self-learning, craftsmanship, and celebrations. Sourced automatically from our Google Drive folder.
          </p>
        </div>

        {loading ? (
          /* Sleek Animated Spinner frame */
          <div className="min-h-[350px] sm:min-h-[450px] flex flex-col justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-clay border-t-brand-green rounded-full animate-spin mb-4" />
            <p className="font-rounded font-extrabold text-xs text-brand-green/70">
              Auto Syncing with Google Drive...
            </p>
          </div>
        ) : currentImg ? (
          /* Central Slideshow View Container */
          <div className="flex flex-col items-center">
            
            {/* The Active Showcase Image Cards with side navigation controllers */}
            <div className="relative w-full bg-white border-3 sm:border-4 border-brand-green rounded-2xl sm:rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_var(--color-brand-green)] sm:shadow-[10px_10px_0px_0px_var(--color-brand-green)] group">
              
              {/* Fade translation slide effect */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setLightboxIndex(currentIndex)}
                  className="w-full h-auto relative cursor-pointer group"
                >
                  <img
                    src={currentImg.url}
                    alt={currentImg.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[75vh] object-contain block select-none mx-auto"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Left Arrow Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-xl border-2 border-brand-green bg-white text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-green transition-all shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-[-45%] active:shadow-none cursor-pointer z-25"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Navigation Right Arrow Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-xl border-2 border-brand-green bg-white text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-green transition-all shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-[-45%] active:shadow-none cursor-pointer z-25"
                aria-label="Next Image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Pagination Bullet Dots Indicator */}
            <div className="flex gap-1.5 mt-5">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? "bg-brand-clay w-6" 
                      : "bg-brand-green/20 w-2 hover:bg-brand-green/45"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* All Photos Trigger Action Button BELOW the image */}
            <div className="mt-8">
              <button
                onClick={() => {
                  window.location.hash = "#all-photos";
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border-3 border-brand-green bg-white text-brand-green font-rounded font-extrabold text-xs tracking-wider uppercase shadow-[4px_4px_0px_0px_var(--color-brand-clay)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer"
              >
                <span>View All Photos</span>
                <ArrowRight className="w-4 h-4 text-brand-clay" />
              </button>
            </div>

          </div>
        ) : (
          /* Empty backup */
          <div className="text-center py-20 bg-white border-3 border-brand-green border-dashed rounded-3xl max-w-md mx-auto">
            <Camera className="w-12 h-12 text-brand-green/30 mx-auto mb-3" />
            <p className="font-display font-bold text-lg text-brand-green">Shared gallery empty</p>
            <p className="font-rounded font-medium text-xs text-brand-green/60 mt-1">
              Add some photographs inside your designated Google Drive folder.
            </p>
          </div>
        )}

      </div>

      {/* Lightbox full-screen zoom layout with left/right arrows & swipe handlers */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
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
                <span>Kishangarh Center ({lightboxIndex + 1} of {images.length})</span>
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
                key={images[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 26, stiffness: 130 }}
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain pointer-events-none select-none drop-shadow-2xl rounded-sm sm:rounded-md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
