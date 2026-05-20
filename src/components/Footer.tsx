import { Compass, Sparkles, Navigation, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-brand-sand border-t-4 border-brand-clay py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-[0.03]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Left segment */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-clay border border-white/20 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-rounded font-bold text-base leading-tight block">
                The Unschooled Mind
              </span>
              <span className="font-mono text-[10px] tracking-wider text-brand-yellow font-bold uppercase">
                Kishangarh, Rajasthan
              </span>
            </div>
          </div>

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
            ✦ Near Khoda Ganesh Temple road, Kishangarh, Rajasthan - 305801 <br />
            ✦ Admissions Phone: +91 82625 03442 <br />
            ✦ Contact: theunschooledmindkishangarh@gmail.com
          </p>
        </div>

        {/* Right segment */}
        <div className="flex flex-col gap-3 font-rounded text-xs text-brand-sand/60">
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-yellow text-brand-sand">
            The Movement
          </h4>
          <p className="leading-relaxed">
            Alternative learning is an organic response to global educational challenges. We believe in child-centric respect, hands-on play, risk management, and self-guided masteries.
          </p>

          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-yellow">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Co-designed in partnership with Rajasthani crafts educators</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs font-mono text-brand-sand/40">
        <p>
          &copy; {currentYear} The Unschooled Mind - Kishangarh. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5 font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>Alternative Learning Space, India</span>
        </p>
      </div>
    </footer>
  );
}
