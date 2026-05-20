import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Sparkles, Footprints, Flame, Compass, HelpCircle, Palette } from "lucide-react";

export default function ExploreActivities() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const crafts = [
    {
      id: "c1",
      title: "Kishangarh Red Clay Pottery",
      category: "studio",
      description: "Using domestic earthenware clay to wheel-sculpt shapes. Teaches patience, balance physics, and sensory integration.",
      icon: <Flame className="w-5 h-5 text-brand-clay" />,
      tag: "Earth Craft",
      features: ["Sourcing raw river mud", "Manual kick-wheel control", "Traditional kiln baking", "Natural mineral dye painting"]
    },
    {
      id: "c2",
      title: "Woodwork & Toy Engineering",
      category: "builders",
      description: "Handling handplanes, clamps, saws, and files to make functional wheels, small desks, and puzzle toys out of solid pine boards.",
      icon: <Hammer className="w-5 h-5 text-brand-yellow" />,
      tag: "Physics Lab",
      features: ["Isometric blueprints", "Grain & thickness grading", "Friction fit joint assemblies", "Organic oil rubbing finishes"]
    },
    {
      id: "c3",
      title: "Outdoor Desert Navigation",
      category: "nature",
      description: "Traversing native sandy slopes and granite trails. Birding using digital zoom, stargazing and collecting dry leaf species.",
      icon: <Footprints className="w-5 h-5 text-brand-green" />,
      tag: "Field Biology",
      features: ["Traditional compass mapping", "Dune flora seed classification", "Constructing clay birds nests", "Rainfall system measurement"]
    },
    {
      id: "c4",
      title: "Collaborative Mural Wall",
      category: "studio",
      description: "Covering vast exterior stone walls in high-pigment wash designs. Encourages visual proportional calculations and collective team layout.",
      icon: <Palette className="w-5 h-5 text-brand-clay" />,
      tag: "Visual Lore",
      features: ["Sizing math grids", "Making charcoal outline guides", "Natural extract brushwork", "Symbolic story presentation"]
    }
  ];

  const filteredCrafts = activeTab === "all" ? crafts : crafts.filter(c => c.category === activeTab);

  return (
    <section id="activities" className="py-24 bg-brand-sand relative">
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-clay px-3 py-1 rounded-full bg-brand-clay/10 border border-brand-clay/20 w-fit inline-block mb-3">
              Daily Explorations
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-green leading-tight">
              Hands-on Workshops <span className="italic font-normal text-brand-clay">& Outdoor Journeys</span>
            </h2>
            <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3 max-w-xl">
              We replace rote blackboard copies with rich physical crafts. Children learn engineering, design, and botany by physically carving and cultivating earth.
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2 font-rounded font-bold text-xs bg-white p-1.5 rounded-xl border border-brand-green/10 shadow-[3px_3px_0px_0px_var(--color-brand-green)]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "all" ? "bg-brand-clay text-white" : "text-brand-green hover:bg-brand-sand"
              }`}
            >
              All Crafts
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "studio" ? "bg-brand-clay text-white" : "text-brand-green hover:bg-brand-sand"
              }`}
            >
              Pottery & Art
            </button>
            <button
              onClick={() => setActiveTab("builders")}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "builders" ? "bg-brand-clay text-white" : "text-brand-green hover:bg-brand-sand"
              }`}
            >
              Woodshop
            </button>
            <button
              onClick={() => setActiveTab("nature")}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === "nature" ? "bg-brand-clay text-white" : "text-brand-green hover:bg-brand-sand"
              }`}
            >
              Nature Walks
            </button>
          </div>
        </div>

        {/* Dynamic Activity Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCrafts.map((craft, idx) => (
              <motion.div
                key={craft.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-3 border-brand-green rounded-2xl p-6 flex flex-col justify-between shadow-[5px_5px_0px_0px_var(--color-brand-green)] hover:shadow-[7px_7px_0px_0px_var(--color-brand-clay)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div>
                  {/* Top line badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 bg-brand-green/10 text-brand-green font-bold rounded-full">
                      {craft.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-sand border border-brand-green/20 flex items-center justify-center">
                      {craft.icon}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-brand-green mb-2">
                    {craft.title}
                  </h3>

                  <p className="font-rounded font-medium text-xs text-brand-green/80 leading-relaxed mb-6">
                    {craft.description}
                  </p>
                </div>

                {/* Bullet Activities */}
                <div>
                  <h4 className="font-mono text-[10px] uppercase font-bold text-brand-clay mb-3 tracking-wider">
                    Exercises we practice
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-rounded font-bold text-brand-green/90">
                    {craft.features.map(feat => (
                      <div key={feat} className="flex items-center gap-1.5 bg-brand-sand/30 p-2 rounded-lg border border-brand-green/10">
                        <span className="text-brand-clay">✔</span>
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
