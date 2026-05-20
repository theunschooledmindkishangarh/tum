import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What exactly is 'Unschooling' or 'Self-Directed' learning?",
      a: "Unschooling is a form of learner-led education. We don't have forced tests, strict text syllabus books, or a standard grading curve. Instead, children are treated as sovereign learners. They choose their own topics and we supply the tutors, heavy-duty workshops, woodworking systems, and scientific materials required to bring their interest to a professional understanding."
    },
    {
      q: "Is 'The Unschooled Mind' registered? How do children take standard board exams?",
      a: "Yes! Children can register under the National Institute of Open Schooling (NIOS), India, or Cambridge boards as private candidates when they reach 10th or 12th standards. Our alumni safely pursue higher university fields, possessing much higher problem-solving and self-study traits than traditional school students."
    },
    {
      q: "What is the daily schedule at the Kishangarh center?",
      a: "We start our mornings with a child-led Council circle to outline individual/group daily craft targets. The rest of the day is split between active creators' workshops (pottery wheel, carpentry, painting, cookery jigs) and outdoor desert field ventures, ensuring zero mechanical seating strain."
    },
    {
      q: "Is there an age criterion for children attending the program?",
      a: "Our community welcomes child exploration spirits aged 5 to 15. We encourage multi-age collaboration, which allows younger kids to absorb advanced language habits naturally while older kids learn empathy, tutoring and organizational dynamics."
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute inset-0 organic-grid pointer-events-none opacity-5" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-16 flex flex-col items-center">
          <HelpCircle className="w-10 h-10 text-brand-clay mb-2 animate-bounce-slow" />
          <h2 className="font-display font-bold text-3xl text-brand-green leading-tight">
            Answering <span className="italic font-normal text-brand-clay">Curious Parent Questions</span>
          </h2>
          <p className="font-rounded font-medium text-brand-green/70 text-sm mt-3">
            Transitioning from the standard schooling system raises natural discussions. Learn how we nurture academic logic alongside creative self-sufficiency safely.
          </p>
        </div>

        {/* Faq Cards */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={idx}
                className="bg-brand-sand/35 border-2 border-brand-green rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-rounded font-bold text-sm md:text-base text-brand-green hover:bg-brand-clay/10 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white border border-brand-green flex items-center justify-center text-brand-green font-bold">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-brand-green/5 text-xs md:text-sm font-rounded font-medium text-brand-green/80 leading-relaxed bg-white/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
