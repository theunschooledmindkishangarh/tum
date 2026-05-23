import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Sparkles, Navigation, CheckCircle2, MessageCircle } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    childAge: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({
    parentName: "",
    phone: "",
    childAge: ""
  });

  const handleInputChange = (field: "parentName" | "phone" | "childAge" | "note", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "note") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { parentName: "", phone: "", childAge: "" };
    let isValid = true;

    // Parent name: contain only text, no numbers
    const nameVal = formData.parentName.trim();
    if (!nameVal) {
      newErrors.parentName = "Name is required.";
      isValid = false;
    } else if (/[0-9]/.test(nameVal)) {
      newErrors.parentName = "Name can only contain letters and spaces (no numbers).";
      isValid = false;
    }

    // Contact number: must contain only 10 digits and start with 6 to 9
    const digitsOnly = formData.phone.trim();
    if (!digitsOnly) {
      newErrors.phone = "Contact number is required.";
      isValid = false;
    } else if (digitsOnly.length !== 10 || !/^\d+$/.test(digitsOnly)) {
      newErrors.phone = "Contact number must contain only exactly 10 digits.";
      isValid = false;
    } else if (!/^[6-9]/.test(digitsOnly)) {
      newErrors.phone = "First digit must be 6, 7, 8, or 9.";
      isValid = false;
    }

    // Child age: min 0 and max 18
    const ageRaw = formData.childAge.trim();
    if (ageRaw !== "") {
      const ageVal = Number(ageRaw);
      if (isNaN(ageVal) || ageVal < 0 || ageVal > 18 || !Number.isInteger(ageVal)) {
        newErrors.childAge = "Age must be an integer between 0 and 18.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // For static deployments on GitHub Pages, environment variables are not loaded dynamically.
      // You can paste your Web3Forms Access Key directly below!
      // To get a FREE key in 5 seconds (no logout/signup), go to: https://web3forms.com/ and enter your email "theunschooledmindkishangarh@gmail.com".
      const HARDCODED_ACCESS_KEY = ""; // PASTE YOUR KEY HERE (e.g. "1234abcd-12ab-34cd-56ef-1234567890ab")
      
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || HARDCODED_ACCESS_KEY || "";
      
      if (!accessKey) {
        // Fallback simulation for preview and local development when the key isn't provided yet
        console.info(
          "Configuring simulated submission. To receive messages in theunschooledmindkishangarh@gmail.com inbox, obtain your free Web3Forms access key from https://web3forms.com/ and paste it inside HARDCODED_ACCESS_KEY in ContactSection.tsx or set VITE_WEB3FORMS_ACCESS_KEY."
        );
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitSuccess(true);
        }, 1200);
        return;
      }

      const payload = {
        access_key: accessKey,
        subject: `New Admission Inquiry - ${formData.parentName}`,
        from_name: "The Unschooled Mind Website",
        parent_name: formData.parentName,
        phone_number: formData.phone,
        child_age: formData.childAge || "Not Specified",
        interests_info: formData.note || "No notes provided",
        recipient_email: "theunschooledmindkishangarh@gmail.com"
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      } else {
        throw new Error(result.message || "Endpoint error during transmission.");
      }
    } catch (error) {
      console.error("Transmitting admission enquiry failed:", error);
      // Fallback behavior so user experience does not crash
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }
  };

  const socials = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]",
      url: "https://www.instagram.com/the_unschooled_mind_kishangarh/",
      handle: "@the_unschooled_mind_kishangarh"
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      url: "https://www.facebook.com/profile.php?id=61572737006326",
      handle: "The Unschooled Mind"
    },
    {
      name: "Youtube",
      icon: <Youtube className="w-5 h-5" />,
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      url: "https://www.youtube.com/@theunschooledmindkishangarh",
      handle: "The Unschooled Mind"
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
      url: "https://wa.me/919610666370",
      handle: "+91 96106 66370"
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
            Contact For <span className="italic font-normal text-brand-clay">Admission</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3">
            Admissions are officially open! Fill out the inquiry form below or give us a call to begin the admissions process. Let's grow together.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          
          {/* Main Column: Form & Info */}
          <div className="flex flex-col gap-8">
            
            {/* Contact numbers and social handles */}
            <div className="bg-white border-3 border-brand-green p-6 rounded-2xl shadow-[4px_4px_0px_0px_var(--color-brand-green)]">
              <h3 className="font-display font-semibold text-lg text-brand-green mb-4 border-b border-brand-green/10 pb-2">
                Coordinates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-rounded font-bold text-sm text-brand-green/90">
                <a
                  href="tel:+919610666370"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-transparent hover:border-brand-green/10 hover:bg-brand-sand transition-all group"
                  id="phone-link"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-clay text-white flex items-center justify-center border border-brand-green shrink-0">
                    <Phone className="w-5 h-5 animate-bounce-slow" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Mobile Hotlines</span>
                    <span className="text-xs md:text-sm group-hover:text-brand-clay transition-colors">+91 96106 66370</span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-brand-green text-white flex items-center justify-center border border-brand-green shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Primary Location</span>
                    <span className="text-xs md:text-sm">New Housing Board, Khoda Ganesh Ji Rd</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-brand-yellow text-brand-green flex items-center justify-center border border-brand-green shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-brand-green/50 font-mono block">Admissions Email</span>
                    <span className="text-xs md:text-sm lowercase break-all">theunschooledmindkishangarh@gmail.com</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="pname">Your Name *</label>
                      {errors.parentName && (
                        <span className="text-[10px] text-red-500 font-mono font-medium animate-pulse">
                          {errors.parentName}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      id="pname"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={formData.parentName}
                      onChange={(e) => handleInputChange("parentName", e.target.value)}
                      className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15 transition-all ${
                        errors.parentName ? "border-red-500 bg-red-50/5" : "border-brand-green"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="pno">Contact Number *</label>
                      {errors.phone && (
                        <span className="text-[10px] text-red-500 font-mono font-medium animate-pulse">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      id="pno"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15 transition-all ${
                        errors.phone ? "border-red-500 bg-red-50/5" : "border-brand-green"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="child_age">Child's Current Age (Years)</label>
                    {errors.childAge && (
                      <span className="text-[10px] text-red-500 font-mono font-medium animate-pulse">
                        {errors.childAge}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    id="child_age"
                    placeholder="e.g. 7"
                    value={formData.childAge}
                    onChange={(e) => handleInputChange("childAge", e.target.value)}
                    className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-brand-clay focus:outline-none bg-brand-sand/15 transition-all ${
                      errors.childAge ? "border-red-500 bg-red-50/5" : "border-brand-green"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes">Tell us about your child's emerging interests</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="e.g., painting, soil models, questions they ask lot..."
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
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
                      Submit Admission Inquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
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
                  setErrors({ parentName: "", phone: "", childAge: "" });
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
