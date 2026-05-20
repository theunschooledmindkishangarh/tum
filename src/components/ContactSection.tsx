import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Sparkles, Navigation, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    childAge: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;
    
    setIsSubmitting(true);
    // Simulate real database submit
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const socials = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]",
      url: "https://www.instagram.com/the.unschooledmind/",
      handle: "@the.unschooledmind"
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      url: "https://www.facebook.com/people/The-Unschooled-Mind-Kishangarh/",
      handle: "The Unschooled Mind"
    },
    {
      name: "Youtube",
      icon: <Youtube className="w-5 h-5" />,
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      url: "https://www.youtube.com/channel/UCI-7lkfwgULHcoW-ExFICmg",
      handle: "The Unschooled Mind"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-brand-sand relative">
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Contact Intro */}
        <div className="max-w-xl mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-clay px-3 py-1 rounded-full bg-brand-clay/10 border border-brand-clay/20 w-fit inline-block mb-3">
            Get in Touch
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight">
            Schedule a <span className="italic font-normal text-brand-clay">Sanctuary Day Visit</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3">
            Bring your child down to our Kishangarh center to play with clay, touch the carpentry logs, and feel the natural learning model themselves. Let's grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Form & Info */}
          <div className="flex flex-col gap-8">
            
            {/* Contact numbers and social handles */}
            <div className="bg-white border-3 border-brand-green p-6 rounded-2xl shadow-[4px_4px_0px_0px_var(--color-brand-green)]">
              <h3 className="font-display font-semibold text-lg text-brand-green mb-4 border-b border-brand-green/10 pb-2">
                Coordinates
              </h3>

              <div className="flex flex-col gap-4 font-rounded font-bold text-sm text-brand-green/90">
                <a
                  href="tel:+918262503442"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-transparent hover:border-brand-green/10 hover:bg-brand-sand transition-all group"
                  id="phone-link"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-clay text-white flex items-center justify-center border border-brand-green">
                    <Phone className="w-5 h-5 animate-bounce-slow" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Mobile Hotlines</span>
                    <span className="text-sm md:text-base group-hover:text-brand-clay transition-colors">+91 82625 03442</span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-brand-green text-white flex items-center justify-center border border-brand-green">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Primary Location</span>
                    <span className="text-xs md:text-sm">Kishangarh, Ajmer District, Rajasthan - 305801</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-brand-yellow text-brand-green flex items-center justify-center border border-brand-green">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Admissions Email</span>
                    <span className="text-xs md:text-sm lowercase">theunschooledmindkishangarh@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Social Channels Dock */}
              <div className="pt-6 mt-4 border-t border-brand-green/10">
                <p className="font-mono text-[10px] uppercase font-bold text-brand-clay mb-3 tracking-wider">
                  Follow the Daily Diaries
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-2 border-2 border-brand-green rounded-xl text-xs font-rounded font-bold text-brand-green flex items-center gap-1.5 transition-all bg-white shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-0.5 active:shadow-none cursor-pointer ${soc.color}`}
                    >
                      {soc.icon}
                      <span>{soc.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Parent Enquiry Form */}
            <div className="bg-white border-3 border-brand-green p-6 rounded-2xl shadow-[4px_4px_0px_0px_var(--color-brand-green)]">
              <h3 className="font-display font-semibold text-lg text-brand-green mb-4">
                Parent Inquiry Form
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-rounded font-semibold text-xs text-brand-green">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pname">Your Name *</label>
                    <input
                      type="text"
                      id="pname"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="p-3 border-2 border-brand-green rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pno">Contact Number *</label>
                    <input
                      type="tel"
                      id="pno"
                      required
                      placeholder="e.g. +91 98765-43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="p-3 border-2 border-brand-green rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="child_age">Child's Current Age (Years)</label>
                  <input
                    type="number"
                    id="child_age"
                    placeholder="e.g. 7"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    className="p-3 border-2 border-brand-green rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes">Tell us about your child's emerging interests</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="e.g., painting, soil models, questions they ask lot..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="p-3 border-2 border-brand-green rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="clay-btn w-full py-3.5 rounded-xl font-rounded font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Transmitting enquiry..."
                  ) : (
                    <>
                      Submit Sanctuary Request
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Google Maps Location Widget */}
          <div className="flex flex-col h-full min-h-[460px]">
            <div className="bg-[#EEF2FF] border-3 border-brand-green p-3 rounded-2xl shadow-[6px_6px_0px_0px_var(--color-brand-green)] flex flex-col justify-between flex-1">
              
              {/* Map Title Tag */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-clay animate-pulse" />
                  <span className="font-rounded font-bold text-xs text-brand-green uppercase tracking-wide">Kishangarh Center Satellite</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Kishangarh,Rajasthan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-wide font-bold text-brand-clay underline flex items-center gap-1 hover:opacity-80"
                >
                  Open Maps App <Navigation className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* The Iframe Map Embed */}
              <div className="w-full h-[360px] lg:h-[460px] rounded-xl border-2 border-brand-green overflow-hidden relative shadow-inner bg-stone-100 my-2">
                <iframe
                  title="The Unschooled Mind Kishangarh Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14272.5414856037!2d74.8580!3d26.5700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be11d61bd26a1%3A0xe13a7c6a0c0a5b28!2sKishangarh%2C%20Rajasthan%20305801!5e0!3m2!1sen!2sin!4v1716178382000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Navigation help */}
              <div className="px-3 py-2.5 bg-white border border-brand-green/20 rounded-lg flex items-start gap-2.5">
                <div className="p-1 rounded bg-brand-green/10 text-brand-green">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="font-rounded font-medium text-[11px] leading-relaxed text-brand-green/70">
                  Our alternative learning community is located inside the scenic, quiet fringes of Kishangarh, Rajasthan. Quiet mountain breeze, safe pathways, and clay pits represent the natural playground environment. 
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Confetti Success Dialogue */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 border-brand-green rounded-2xl max-w-md w-full p-6 text-center text-brand-green shadow-2xl relative"
            >
              <div className="w-14 h-14 rounded-full bg-brand-clay/15 text-brand-clay border border-brand-clay/35 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-display font-bold text-2xl mb-2">
                Enquiry Transmitted!
              </h3>
              
              <p className="font-rounded font-medium text-xs leading-relaxed text-brand-green/80 mb-5 text-center">
                Pristine choices. We have safely logged your coordinates and child insights. The admissions guardians of <strong className="text-brand-clay">The Unschooled Mind</strong> will contact your phone coordinate within 24 hours to schedule your walk-in play day.
              </p>

              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({ parentName: "", phone: "", childAge: "", note: "" });
                }}
                className="clay-btn px-6 py-2.5 rounded-xl font-rounded font-bold text-xs"
              >
                Amazing, thank you!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
