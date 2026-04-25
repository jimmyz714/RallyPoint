import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Check, X, Info, Sparkles } from "lucide-react";

const TOPICS = [
  { id: "climate", title: "Climate & Environment", desc: "Protecting our local ecosystems and pushing for green energy.", icon: "🌱", color: "bg-emerald-50 text-emerald-600" },
  { id: "housing", title: "Housing Affordability", desc: "Advocating for fair rent and more community housing projects.", icon: "🏠", color: "bg-blue-50 text-blue-600" },
  { id: "labor", title: "Labor Rights", desc: "Better wages, safety, and representation for all workers.", icon: "👷", color: "bg-orange-50 text-orange-600" },
  { id: "transit", title: "Public Transit", desc: "Expanding BART and bus routes for a car-free Berkeley.", icon: "🚌", color: "bg-purple-50 text-purple-600" },
  { id: "edu", title: "Education", desc: "Investing in schools and after-school community programs.", icon: "📚", color: "bg-pink-50 text-pink-600" },
  { id: "justice", title: "Criminal Justice", desc: "Reforming policing and support for restorative justice.", icon: "⚖️", color: "bg-indigo-50 text-indigo-600" },
  { id: "food", title: "Food Security", desc: "Ensuring no neighbor goes hungry through community pantries.", icon: "🍎", color: "bg-yellow-50 text-yellow-600" },
];

/**
 * Sub-component for a single Swipeable Card to isolate its motion state.
 * This ensures that when a new card is mounted, its 'x' motion value always starts at 0,
 * and it doesn't inherit the exit translation of the previous card.
 */
interface CardProps {
  topic: any;
  theme: string;
  onSwipe: (dir: "left" | "right") => void;
  swipeDirection: "left" | "right" | null;
  key?: any;
}

function Card({ topic, theme, onSwipe, swipeDirection }: CardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -50], [1, 0]);

  return (
    <motion.div
      key={topic.id}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe("right");
        else if (info.offset.x < -100) onSwipe("left");
      }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ 
        x: swipeDirection === "right" ? 500 : (swipeDirection === "left" ? -500 : (x.get() > 0 ? 500 : -500)), 
        opacity: 0, 
        transition: { duration: 0.3 } 
      }}
      className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden touch-none transition-colors"
    >
      {/* Visual Feedback Overlay */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-10 right-10 border-4 border-emerald-500 text-emerald-500 rounded-lg px-4 py-1 font-black text-4xl rotate-12 z-20 pointer-events-none"
      >
        LIKE
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-10 left-10 border-4 border-red-500 text-red-500 rounded-lg px-4 py-1 font-black text-4xl -rotate-12 z-20 pointer-events-none"
      >
        NOPE
      </motion.div>

      <div className={cn("flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors", theme === 'dark' ? "bg-emerald-950/20" : topic.color)}>
        <span className="text-7xl mb-6">{topic.icon}</span>
        <h3 className="text-2xl font-serif font-bold mb-3 dark:text-gray-100">{topic.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed max-w-[240px]">
          {topic.desc}
        </p>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 flex justify-center gap-4 transition-colors">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 dark:text-gray-500">
          <Info className="w-4 h-4" />
          Civic Impact Area
        </div>
      </div>
    </motion.div>
  );
}

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const { completeOnboarding, theme } = useStore();
  const navigate = useNavigate();

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    const topic = TOPICS[currentIndex];
    if (direction === "right") {
      setSelected(prev => [...prev, topic.title]);
    }
    
    if (currentIndex < TOPICS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    const finalSelection = selected.length >= 3 ? selected : [...selected, ...TOPICS.slice(0, 3).map(t => t.title)].slice(0, 3);
    completeOnboarding(finalSelection);
    navigate("/");
  };

  const currentTopic = TOPICS[currentIndex];

  return (
    <div className="flex-1 bg-[#f4f2ea] dark:bg-gray-950 flex flex-col items-center p-6 font-sans select-none relative overflow-y-auto no-scrollbar transition-colors duration-300">
      <div className="w-full mt-4 flex flex-col items-center flex-1">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / TOPICS.length) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8 px-2">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">Personalize your pulse</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Swipe right if you care about the issue, left to skip. Pick at least 3.</p>
        </div>

        {/* Swipe Container */}
        <div className="relative w-full aspect-[3/4] max-h-[500px] mb-8">
          <AnimatePresence mode="wait">
            {currentIndex < TOPICS.length ? (
              <Card 
                key={currentTopic.id}
                topic={currentTopic}
                theme={theme}
                swipeDirection={swipeDirection}
                onSwipe={handleSwipe}
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-8 text-center transition-colors"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2 dark:text-gray-100">Great Selections!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  You've selected {selected.length} causes. We're ready to curate your feed.
                </p>
                <button 
                  onClick={finish}
                  className="w-full bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl py-4 font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
                >
                  Enter the City Pulse
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control Buttons */}
        {currentIndex < TOPICS.length && (
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => handleSwipe("left")}
              className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-500 shadow-md border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleSwipe("right")}
              className="w-16 h-16 bg-emerald-600 dark:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-110 active:scale-95 transition-all"
            >
              <Check className="w-8 h-8" />
            </button>
          </div>
        )}

        <div className="mt-auto py-8">
          <p className="text-[12px] text-gray-400 dark:text-gray-400 text-center px-6">
            Help us understand what matters. You can always change these topics later in your profile.
          </p>
        </div>

      </div>
    </div>
  );
}
