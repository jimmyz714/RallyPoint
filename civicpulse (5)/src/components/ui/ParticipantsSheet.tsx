import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, MessageSquare, Handshake } from "lucide-react";
import { cn } from "../../lib/utils";

interface ParticipantsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  eventTitle: string;
}

const MOCK_PARTICIPANTS = [
  { id: '1', name: "Maya Rodriguez", status: "Friend", active: true, init: "MR" },
  { id: '2', name: "Jordan Taylor", status: "Active Neighbor", active: false, init: "JT" },
  { id: '3', name: "Alex Chen", status: "Focus: Housing", active: true, init: "AC" },
  { id: '4', name: "Sam Wilson", status: "Berkeley Native", active: false, init: "SW" },
  { id: '5', name: "Elena Gomez", status: "Climate Advocate", active: true, init: "EG" },
  { id: '6', name: "Marcus Thorne", status: "Top 10 Leaderboard", active: false, init: "MT" },
  { id: '7', name: "Sarah J.", status: "New Member", active: true, init: "SJ" },
];

export default function ParticipantsSheet({ isOpen, onClose, count, eventTitle }: ParticipantsSheetProps) {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const handleMessage = (id: string) => {
    setActiveMessageId(id);
    setTimeout(() => setActiveMessageId(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-md h-[75vh] bg-[#fcfaf7] dark:bg-gray-950 rounded-t-[2.5rem] flex flex-col shadow-2xl border-t border-white dark:border-gray-800 pointer-events-auto relative overflow-hidden transition-colors duration-300">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100/50 dark:border-gray-800/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 transition-colors">Who's attending</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[280px] transition-colors">{eventTitle}</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-900 transition-colors">
                    <Users className="w-3.5 h-3.5" />
                    {count} TOTAL
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-900 transition-colors">
                    <Handshake className="w-3.5 h-3.5" />
                    3 FRIENDS
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                <div className="space-y-4 pb-20">
                  {MOCK_PARTICIPANTS.map((p) => (
                    <div key={p.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 transition-colors">
                            {p.init}
                          </div>
                          {p.active && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#fcfaf7] dark:border-gray-950 transition-colors" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors">
                            {p.name}
                            {p.status === "Friend" && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-black transition-colors">Friend</span>}
                          </div>
                          <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium transition-colors">{p.status}</div>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => handleMessage(p.id)}
                          className={cn(
                            "p-2 rounded-xl transition-all duration-300",
                            activeMessageId === p.id 
                              ? "bg-emerald-600 text-white" 
                              : "hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          )}
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {activeMessageId === p.id && (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg"
                            >
                              INVITATION SENT
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 text-center">
                    <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">
                      + {Math.max(0, count - MOCK_PARTICIPANTS.length)} more neighbors
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fcfaf7] dark:from-gray-950 via-[#fcfaf7] dark:via-gray-950 to-transparent pt-12 transition-all">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
                >
                  Connect with Neighbors
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
