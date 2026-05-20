import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Minimize2, ZoomIn, MapPin, Camera, ChevronLeft, ChevronRight, Instagram } from "lucide-react";

export default function PhotoGallery3D() {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; desc: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"Activity" | "Celebrations">("Activity");
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    {
      url: "/src/assets/images/student_girl_1779270352412.png",
      title: "Self-Guided Active Learner",
      desc: "Joy of self-directed primary study, balancing practical doing with boundless natural curiosity.",
      category: "Activity"
    },
    {
      url: "/src/assets/images/outdoor_painting_1779250443852.png",
      title: "Collaborative Canvas Painting",
      desc: "Working team-wise on dynamic large-scale murals under a shady tree in our open schoolyard.",
      category: "Activity"
    },
    {
      url: "/src/assets/images/nature_exploration_1779250482557.png",
      title: "Gardening & Seed Cultivation",
      desc: "Pruning seedlings, watering soil, and experiencing life cycle biology through hands-on gardening.",
      category: "Activity"
    },
    {
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop",
      title: "Carpentry & Practical Woodwork",
      desc: "Sanding scrap boards and hammering organic balance planks to understand simple machine laws.",
      category: "Activity"
    },
    {
      url: "/src/assets/images/cozy_reading_1779250461671.png",
      title: "Cozy Storytelling Circles",
      desc: "Sharing picture books and creative folk stories underneath the rustling leaves of tree canopies.",
      category: "Activity"
    },
    // Celebrations category
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      title: "Annual Organic Food Festival",
      desc: "Celebrating student-grown heritage vegetables, presenting home-ground spices, and catering organic recipes to our families and neighbors.",
      category: "Celebrations"
    },
    {
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop",
      title: "Seasonal Solstice Gatherings",
      desc: "Parent council assemblies under lanterns, marked by organic slow food fires and open acoustic songs.",
      category: "Celebrations"
    },
    {
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
      title: "Sovereign Arts & Theater Day",
      desc: "A massive celebration of visual play-acting, physical theater works, custom puppets, and creative light installations.",
      category: "Celebrations"
    }
  ];

  const filteredImages = images.filter((img) => img.category === activeTab);
  const currentImg = filteredImages[activeIndex] || filteredImages[0] || images[0];

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + filteredImages.length) % filteredImages.length;
    setActiveIndex(nextIdx);
    if (lightboxImage) {
      setLightboxImage(filteredImages[nextIdx]);
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % filteredImages.length;
    setActiveIndex(nextIdx);
    if (lightboxImage) {
      setLightboxImage(filteredImages[nextIdx]);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-brand-sand relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-10" />
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-brand-clay/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-10 flex flex-col items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-clay px-3 py-1 rounded-full bg-brand-clay/10 border border-brand-clay/20 w-fit inline-block mb-3">
            Experiential Gallery
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight">
            Life inside <span className="italic font-normal text-brand-clay">"The Unschooled Mind"</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3 leading-relaxed">
            Browse authentic snapshots of kid-led days and community celebrations. Click each tab to switch views.
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {(["Activity", "Celebrations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveIndex(0);
              }}
              className={`px-6 py-3 rounded-xl border-2 font-rounded font-extrabold text-sm transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-brand-green border-brand-green text-brand-sand shadow-[3px_3px_0px_0px_var(--color-brand-clay)] translate-y-[-1px]"
                  : "bg-white border-brand-green/20 text-brand-green/85 hover:border-brand-green hover:text-brand-green hover:bg-brand-green/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Single Photo Card Slider */}
        <div className="max-w-xl mx-auto relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImg.url}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col bg-white border-3 border-brand-green rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_var(--color-brand-green)] hover:shadow-[6px_6px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
            >
              {/* Media Screen Container */}
              <div 
                onClick={() => setLightboxImage(currentImg)}
                className="relative aspect-video w-full bg-black border-b-2 border-brand-green overflow-hidden cursor-pointer"
              >
                <img
                  src={currentImg.url}
                  alt={currentImg.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-green/10 mix-blend-multiply transition-opacity group-hover:opacity-20" />
                
                {/* Center Hover Play/Zoom Circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-brand-clay text-white flex items-center justify-center border-2 border-brand-green shadow-lg scale-90 group-hover:scale-100 transition-all">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Badges Overlays */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white border border-brand-green text-[9px] font-mono tracking-widest font-bold text-brand-green uppercase">
                  {currentImg.category}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="font-display font-bold text-lg text-brand-green leading-snug group-hover:text-brand-clay transition-colors">
                    {currentImg.title}
                  </h3>
                  <p className="font-rounded font-medium text-xs text-brand-green/70 leading-relaxed min-h-[40px]">
                    {currentImg.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-green/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-clay font-bold">
                    <Camera className="w-4 h-4 text-brand-clay" />
                    Kishangarh Live
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImage(currentImg);
                    }}
                    className="text-xs font-rounded font-bold flex items-center gap-1 text-brand-green hover:text-brand-clay cursor-pointer"
                  >
                    View Photo ➔
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Navigation Controls */}
          <div className="absolute top-1/2 -left-3 md:-left-16 transform -translate-y-1/2 z-10 flex">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -right-3 md:-right-16 transform -translate-y-1/2 z-10 flex">
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators / Progress Dot bar */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {filteredImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === i ? "w-8 bg-brand-clay" : "w-2.5 bg-brand-green/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Instagram Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-5xl mx-auto bg-brand-sand/50 border-3 border-brand-clay rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-clay flex items-center justify-center text-white border-2 border-brand-green">
              <Instagram className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h4 className="font-display font-medium text-lg text-brand-green leading-tight">
                Follow our journey on Instagram!
              </h4>
              <p className="font-rounded font-medium text-xs text-brand-green/70 mt-1">
                Stay updated with our daily activities, raw unschooled moments, creative pottery, and updates from Kishangarh.
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/the.unschooledmind/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-brand-clay border-2 border-brand-green font-rounded font-bold text-xs text-white shadow-[3px_3px_0px_0px_var(--color-brand-green)] hover:bg-brand-clay/90 hover:translate-y-[-1px] transition-all cursor-pointer whitespace-nowrap"
          >
            Visit Instagram Profile
          </a>
        </motion.div>

      </div>

      {/* Fully Functional Full-Screen Zoom Lightbox Portal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Desktop Left Navigation Button */}
            <button
              onClick={handlePrev}
              className="mr-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl w-full bg-brand-sand rounded-2xl border-4 border-brand-green overflow-hidden p-3 shadow-2xl">
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 max-h-[50vh] md:max-h-none overflow-hidden rounded-xl border-2 border-brand-green relative group">
                  <img
                    src={lightboxImage.url}
                    alt={lightboxImage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-[350px] object-cover"
                  />

                  {/* Mobile Left Floater Button */}
                  <div className="absolute inset-y-0 left-2 flex items-center">
                    <button
                      onClick={handlePrev}
                      className="p-2 md:hidden rounded-full bg-white/90 border border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Right Floater Button */}
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                      onClick={handleNext}
                      className="p-2 md:hidden rounded-full bg-white/90 border border-brand-green text-brand-green hover:bg-brand-clay hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center"
                      aria-label="Next Image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full md:w-[280px] flex flex-col justify-between py-2 text-brand-green">
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[10px] bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-md uppercase tracking-wider font-bold w-fit font-extrabold">
                      {lightboxImage.category} Life
                    </span>
                    <h3 className="font-display font-bold text-2xl leading-snug">
                      {lightboxImage.title}
                    </h3>
                    <p className="font-rounded font-medium text-xs leading-relaxed text-brand-green/70">
                      {lightboxImage.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-green/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-clay font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      Kishangarh Center
                    </div>
                    <button
                      onClick={() => setLightboxImage(null)}
                      className="px-4 py-2 rounded-lg bg-brand-green text-white font-rounded font-bold text-xs hover:bg-brand-clay transition-all cursor-pointer"
                    >
                      Close Zoom
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Right Navigation Button */}
            <button
              onClick={handleNext}
              className="ml-6 p-4 rounded-full bg-white border-2 border-brand-green text-brand-green hover:bg-brand-clay hover:text-white hover:border-brand-clay hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer hidden md:flex items-center justify-center shrink-0"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
