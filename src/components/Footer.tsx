import { Sparkles, Navigation, Globe } from "lucide-react";
import HangingLogo3D from "./HangingLogo3D";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-brand-sand border-t-4 border-brand-clay py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-[0.03]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left segment */}
        <div className="flex flex-col gap-4 overflow-visible">
          <p className="font-rounded font-medium text-xs text-brand-sand/70 max-w-sm leading-relaxed">
            Nurturing native childhood curiosity, sensory craftsmanship, and sovereign intellectual courage inside Rajasthan's organic terrains.
          </p>
        </div>

        {/* Center segment */}
        <div className="flex flex-col gap-3 font-rounded">
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-yellow">
            Admissions & Info
          </h4>
          <p className="text-xs text-brand-sand/80 leading-relaxed font-semibold">
            ✦ New Housing Board, Khoda Ganesh Ji Road, Kishangarh, Ajmer <br />
            ✦ Admissions Phone: +91 96106 66370 <br />
            ✦ Contact: theunschooledmindkishangarh@gmail.com
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs font-mono text-brand-sand/40">
        <p>
          &copy; {currentYear} The Unschooled Mind - Kishangarh. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
