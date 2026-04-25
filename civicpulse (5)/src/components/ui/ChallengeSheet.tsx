import { useState, useMemo } from "react";
import { cn } from "../../lib/utils";
import { Check, X } from "lucide-react";
import { useDraggableScroll } from "../../hooks/useDraggableScroll";

interface ChallengeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  friendName: string;
}

const mockQuests = [
  { id: '1', title: 'Attend a city council meeting', desc: 'Show up to any Berkeley, Oakland, or Fremont city council session and check in via the app.', pts: 50, days: 7, type: 'City council' },
  { id: '2', title: 'Submit public comment', desc: 'Speak or write during public comment at any official government meeting on a local issue.', pts: 50, days: 7, type: 'City council' },
  { id: '3', title: 'Join a neighborhood cleanup', desc: 'Participate in any organized cleanup event in your area and log at least 1 hour of service.', pts: 50, days: 7, type: 'Community' },
  { id: '4', title: 'Attend a climate rally or forum', desc: 'Go to a local climate action event or public forum and check in. Bonus points for bringing a friend.', pts: 50, days: 7, type: 'Climate' },
  { id: '5', title: 'Volunteer at a food pantry', desc: 'Sign up and complete at least one volunteer shift at a local food bank or community pantry.', pts: 50, days: 7, type: 'Community' },
  { id: '6', title: 'Support a labor negotiation rally', desc: 'Stand in solidarity with local workers at an upcoming labor rally and sign the digital pledge.', pts: 50, days: 7, type: 'Labor' },
];

export default function ChallengeSheet({ isOpen, onClose, friendName }: ChallengeSheetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const scrollProps = useDraggableScroll();

  const filteredQuests = useMemo(() => {
    if (activeCategory === 'All') return mockQuests;
    return mockQuests.filter(q => q.type === activeCategory);
  }, [activeCategory]);

  const handleSend = () => {
    if (!selected) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelected(null);
      setActiveCategory('All');
      onClose();
    }, 1500);
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 z-50 flex justify-center items-end transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={onClose}
      />
      <div 
        className={cn(
          "w-full max-w-md h-[85vh] bg-[#f8f9fa] dark:bg-gray-900 rounded-t-3xl relative flex flex-col transition-all duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 dark:border-gray-800",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Challenge Sent!</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">You challenged {friendName}. They have 7 days to complete it.</p>
          </div>
        ) : (
          <>
            <div className="px-6 pb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Challenging</div>
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">{friendName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pick a quest to send — they'll have 7 days to complete it</p>
            </div>

            <div 
              className={cn("flex px-6 gap-2 overflow-x-auto select-none pb-3 no-scrollbar", scrollProps.className)}
              ref={scrollProps.ref}
              onMouseDown={scrollProps.onMouseDown}
              onMouseLeave={scrollProps.onMouseLeave}
              onMouseUp={scrollProps.onMouseUp}
              onMouseMove={scrollProps.onMouseMove}
              onClickCapture={scrollProps.onClickCapture}
            >
              {['All', 'City council', 'Climate', 'Community', 'Labor'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveCategory(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-colors flex-shrink-0",
                    activeCategory === t 
                      ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 dark:border-emerald-700" 
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-24 no-scrollbar">
              {filteredQuests.map(q => (
                <div 
                  key={q.id}
                  onClick={() => setSelected(q.id)}
                  className={cn(
                    "bg-white dark:bg-gray-800 border rounded-2xl p-4 flex gap-4 cursor-pointer transition-all active:scale-[0.98]",
                    selected === q.id ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", 
                    q.type === 'City council' ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400" :
                    q.type === 'Community' ? "bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400"
                  )}>
                    {/* Icon mock */}
                    <div className="w-4 h-4 bg-current rounded-sm" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 mb-1 leading-tight">{q.title}</h4>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-snug mb-3">{q.desc}</p>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-emerald-600 dark:text-emerald-400">+{q.pts} pts</span>
                      <span className="text-gray-400 dark:text-gray-500">Complete in {q.days} days</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      selected === q.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300 dark:border-gray-700"
                    )}>
                      {selected === q.id && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8f9fa] dark:from-gray-900 via-[#f8f9fa] dark:via-gray-900 to-transparent pt-12 pb-safe-offset-4 pointer-events-none transition-all duration-300">
              <button 
                onClick={handleSend}
                disabled={!selected}
                className={cn(
                  "w-full py-3.5 rounded-xl font-medium text-white transition-all pointer-events-auto",
                  !selected ? "bg-emerald-600/50 cursor-not-allowed translate-y-2 opacity-50" : "bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 active:scale-[0.98] translate-y-0"
                )}
              >
                Send challenge
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
