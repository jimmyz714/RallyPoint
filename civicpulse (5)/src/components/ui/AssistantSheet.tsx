import React, { useState, useEffect, useRef } from "react";
import { X, Send, Info, MapPin, Calendar, Star, Users, ChevronRight, MessageSquare } from "lucide-react";
import { cn } from "../../lib/utils";

interface Message {
  role: 'ai' | 'user';
  text: string;
  time?: string;
  card?: {
    type: 'org' | 'events';
    title?: string;
    avatar?: string;
    tags?: string;
    pill?: string;
    body?: React.ReactNode;
    eventsList?: {
      id: string;
      title: string;
      category: string;
      date: string;
      location: string;
      attending: number;
      host: string;
      points: number;
      color: string;
    }[];
  };
}

interface AssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
}

export default function AssistantSheet({ isOpen, onClose, contextMessage }: AssistantSheetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: "Hi! I can summarize events, explain who's organizing them, or break down local civic terms.",
      time: "9:41 AM"
    }
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to allow cards/DOM to layout before scrolling
    const timer = setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Lock body scroll when Bottom Sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (contextMessage && messages.length === 1) {
         handleSend(contextMessage);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text, time: now }]);
    if (!textOverride) setInput("");
    
    // Mock response logic
    if (text.toLowerCase().includes("coalition")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "A coalition is a group of different people, organizations, or even countries that join together for a common purpose or to achieve a specific goal, often in politics or social action.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("bay area")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "The San Francisco Bay Area is a diverse region surrounding the San Francisco and San Pablo estuaries. It's known for its tech innovation, cultural diversity, and unique civic landscape across 9 counties.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("nonprofit")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "A nonprofit is a legal entity organized and operated for a collective, public or social benefit, in contrast with an entity that operates as a business aiming to generate a profit for its owners.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("involved with eblc") || text.toLowerCase().includes("events does eblc")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "EBLC has several ways to get involved! You can attend their monthly town halls, sign up for the 'Green Streets' volunteer program, or join their policy advocacy subgroup. Here are their next events:",
          time: now,
          card: {
            type: 'events',
            eventsList: [
              { id: 'e1', title: 'EBLC Town Hall — Berkeley North', category: 'CIVIC · BERKELEY', date: 'Tue, May 6 · 6:40 PM', location: 'North Berkeley Senior Center', attending: 42, host: 'Hosted by EBLC', points: 40, color: 'emerald' },
              { id: 'e2', title: 'Community Garden Restoration', category: 'VOLUNTEER · OAKLAND', date: 'Sat, May 10 · 10:00 AM', location: 'West Oakland Hub', attending: 15, host: 'Hosted by EBLC', points: 100, color: 'blue' },
            ]
          }
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("eblc") && !text.toLowerCase().includes("climate")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "A regional civic and policy organization in the East Bay that brings together businesses and community leaders. Focuses on public policy, economic development, and quality of life issues. Acts as a bridge between government, private sector, and the community, influencing decisions and shaping local initiatives",
          time: now,
          card: {
            type: 'org',
            title: "East Bay Leadership Council",
            avatar: "EB",
            tags: "NONPROFIT · COMMUNITY ORG",
            pill: "EBLC",
            body: (
              <>
                A regional civic and policy organization in the <span className="font-bold">East Bay</span> that brings together businesses and community leaders. Focuses on <span className="font-bold">public policy</span>, <span className="font-bold">economic development</span>, and <span className="font-bold">quality of life issues</span>. Acts as a bridge between government, private sector, and the community, influencing decisions and shaping local initiatives
              </>
            )
          }
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("climate")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Found 2 upcoming climate events near Berkeley for you 🌱",
          time: now,
          card: {
            type: 'events',
            eventsList: [
              { id: '2', title: 'Earth Day Cleanup', category: 'CLIMATE · BERKELEY', date: 'Sat, Apr 18 · 9:00 AM', location: '160 University Ave, Berkeley, CA 94710', attending: 132, host: 'Hosted by Berkeley City Council', points: 80, color: 'emerald' },
              { id: '1', title: 'Arbor Day + Spring Planting Events', category: 'CLIMATE · BERKELEY', date: 'Sat, Apr 18 · 9:00 AM – 11:00 AM', location: '160 University Ave, Berkeley, CA 94710', attending: 47, host: 'Hosted by Berkeley City Council', points: 80, color: 'blue' },
            ]
          }
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: "Tap any card to learn more or get directions. Want me to show more climate events or filter by date?",
            time: now
          }]);
        }, 1200);
      }, 800);
    } else if (text.toLowerCase().includes("rezoning")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Rezoning is the process of changing the assigned use of a parcel of land. For example, changing a lot from 'Industrial' to 'Residential' to allow for new apartment buildings. This usually requires a public hearing and city council approval.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("view events for") || text.toLowerCase().includes("show events for")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `Here are the latest events organized by ${text.split('for').pop()?.trim() || 'this organization'}:`,
          time: now,
          card: {
            type: 'events',
            eventsList: [
              { id: 'v1', title: 'Monthly Community Meeting', category: 'CIVIC · DISCUSSION', date: 'Wed, May 21 · 6:00 PM', location: 'Berkley Community Center', attending: 32, host: 'EBLC', points: 40, color: 'emerald' },
              { id: 'v2', title: 'Local Policy Workshop', category: 'POLICY · EDUCATION', date: 'Sat, May 24 · 2:00 PM', location: 'Public Library', attending: 18, host: 'City of Berkeley', points: 30, color: 'blue' },
            ]
          }
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("learn more about")) {
      const org = text.split('about').pop()?.trim() || 'this organization';
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `${org} is a key partner in our local civic ecosystem. They focus on community-driven solutions and transparent policy advocacy. Would you like to see their founding documents or their latest financial report?`,
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("rsvp for")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "To RSVP, simply click the 'RSVP' button on the event card. I've sent a notification to the event host, and you'll receive a confirmation email shortly. Don't forget to check in at the venue to claim your points!",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("high speed rail")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "The California High-Speed Rail is a high-speed rail system currently under construction in California. It's designed to connect the Mega-Regions of the state, contribute to economic development, and provide a clean alternative to short-haul flights.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("green new deal")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "The Green New Deal is a set of proposed social and economic reforms and public works projects aimed at addressing climate change and economic inequality. It focuses on transitioning to 100% clean energy and creating millions of high-paying jobs.",
          time: now
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("zoning meetings") || text.toLowerCase().includes("zoning in berkeley")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "I found 2 upcoming zoning-related meetings in Berkeley:",
          time: now,
          card: {
            type: 'events',
            eventsList: [
              { id: 'z1', title: 'Planning Commission — Zoning Adjustments', category: 'ZONING · BERKELEY', date: 'Thu, May 8 · 7:00 PM', location: 'Berkeley City Hall, Room 123', attending: 24, host: 'City of Berkeley', points: 30, color: 'blue' },
              { id: 'z2', title: 'South Berkeley Residential Rezoning Hearing', category: 'HOUSING · BERKELEY', date: 'Wed, May 14 · 6:30 PM', location: 'Tarea Hall Pittman South Branch', attending: 45, host: 'Oakland Housing Coalition', points: 50, color: 'emerald' },
            ]
          }
        }]);
      }, 800);
    } else if (text.toLowerCase().includes("zoning")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Zoning is a rule used by local governments to control how land can be used in different areas. For example, a city might divide land into zones such as: residential (houses), commercial (shops, offices), industrial (factories).",
          time: now,
          card: {
            type: 'org',
            title: "Zoning",
            avatar: "Z",
            tags: "CIVIC TERM · LAND USE POLICY",
            pill: "POLICY",
            body: (
              <>
                Zoning is a rule used by local governments to control how land can be used in different areas. For example, a city might divide land into zones such as, <span className="font-bold">residential (houses)</span>, <span className="font-bold">commercial (shops, offices)</span>, <span className="font-bold">industrial (factories)</span>.
              </>
            )
          }
        }]);
      }, 800);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "I'm processing that for you. Is there something specific about the local impact you're curious about?",
          time: now
        }]);
      }, 800);
    }
  };

  const suggestions = [
    { text: 'What does "coalition" mean?', icon: <Info className="w-4 h-4 text-emerald-600" />, sub: "Glossary · Civic term", color: "bg-emerald-50 dark:bg-emerald-950/30", special: true },
    { text: 'What is the Bay Area?', icon: <MapPin className="w-4 h-4 text-blue-500" />, sub: "Geography · Local context", color: "bg-blue-50 dark:bg-blue-950/30" },
    { text: 'What does "nonprofit" mean?', icon: <Star className="w-4 h-4 text-purple-500" />, sub: "Glossary · Org type", color: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div 
        className={cn(
          "w-full max-w-md bg-[#F5F2EA] dark:bg-gray-950 h-[85vh] rounded-t-[32px] relative flex flex-col transition-transform duration-500 shadow-2xl overflow-hidden mb-safe-offset-2",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 w-full shrink-0">
          <div className="w-8 h-1 bg-gray-300 dark:bg-gray-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-1 shrink-0 bg-[#F5F2EA] dark:bg-gray-950">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Event assistant</h3>
            <p className="text-[14px] text-gray-400 font-medium">Ask about any event or term</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-full text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className="space-y-1">
              <div className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                {msg.card ? (
                  <div className="w-full space-y-4">
                    {msg.card.type === 'org' ? (
                      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-4 flex items-start justify-between border-b border-gray-50 dark:border-gray-800">
                          <div className="flex gap-3 items-center">
                            <div className={cn(
                              "w-12 h-12 flex items-center justify-center font-bold shrink-0",
                              msg.card.pill === 'POLICY' 
                                ? "rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
                                : "rounded-full bg-emerald-600 text-white"
                            )}>
                              {msg.card.pill === 'POLICY' ? <MessageSquare className="w-6 h-6" /> : msg.card.avatar}
                            </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{msg.card.title}</h4>
                                <div className={cn(
                                  "flex items-center gap-1.5 text-[11px] font-bold tracking-wide mt-0.5",
                                  msg.card.pill === 'POLICY' ? "text-blue-600 dark:text-blue-400" : "text-emerald-600"
                                )}>
                                  {msg.card.tags?.split(' · ').map((tag, idx, arr) => (
                                    <span key={idx} className="flex items-center gap-1.5">
                                      <button 
                                        onClick={() => handleSend(`What is ${tag}?`)}
                                        className="hover:underline hover:opacity-80 transition-all active:scale-95 whitespace-nowrap"
                                      >
                                        {tag}
                                      </button>
                                      {idx < arr.length - 1 && <span className="opacity-40 font-normal">·</span>}
                                    </span>
                                  ))}
                                </div>
                              </div>
                          </div>
                          <div className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                            msg.card.pill === 'POLICY' 
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                              : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          )}>
                            {msg.card.pill}
                          </div>
                        </div>
                        <div className="p-4 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                          {msg.card.body}
                        </div>
                        <div className="px-4 pb-4 flex gap-3">
                          <button 
                            type="button"
                            onClick={() => handleSend(`View events for ${msg.card?.title}`)}
                            className="flex-1 py-2.5 rounded-full border border-gray-100 dark:border-gray-800 text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-[#F5F2EA]/50"
                          >
                            View events
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleSend(`Learn more about ${msg.card?.title}`)}
                            className="flex-1 py-2.5 rounded-full bg-[#1A8D63] text-white text-[14px] font-bold hover:bg-[#157250] transition-colors"
                          >
                            Learn more
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full space-y-3">
                        {msg.card.eventsList?.map(event => (
                          <div key={event.id} className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-4 flex flex-col gap-2 relative">
                              <div className={cn(
                                "absolute left-0 top-4 bottom-4 w-1 rounded-r-full",
                                event.color === 'emerald' ? "bg-emerald-500" :
                                event.color === 'blue' ? "bg-blue-500" :
                                event.color === 'orange' ? "bg-orange-500" : "bg-indigo-500"
                              )} />
                              <div className="pl-2">
                                <div className={cn(
                                  "flex items-center gap-1.5 text-[10px] font-bold tracking-wider",
                                  event.color === 'emerald' ? "text-emerald-700 dark:text-emerald-400" :
                                  event.color === 'blue' ? "text-blue-700 dark:text-blue-400" :
                                  event.color === 'orange' ? "text-orange-700 dark:text-orange-400" : "text-indigo-700 dark:text-indigo-400"
                                )}>
                                  {event.category.split(' · ').map((tag, idx, arr) => (
                                    <span key={idx} className="flex items-center gap-1.5">
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleSend(`What is ${tag.trim()}?`); }}
                                        className="hover:underline hover:opacity-80 transition-all active:scale-95 whitespace-nowrap"
                                      >
                                        {tag}
                                      </button>
                                      {idx < arr.length - 1 && <span className="opacity-40 font-normal">·</span>}
                                    </span>
                                  ))}
                                </div>
                                <h4 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 leading-tight mt-1">{event.title}</h4>
                                <div className="mt-3 space-y-1.5">
                                  <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {event.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
                                    <Users className="w-3.5 h-3.5" />
                                    {event.attending} attending · {event.host}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                              <span className={cn(
                                "text-[13px] font-bold",
                                event.color === 'emerald' ? "text-emerald-700 dark:text-emerald-400" :
                                event.color === 'blue' ? "text-blue-700 dark:text-blue-400" :
                                event.color === 'orange' ? "text-orange-700 dark:text-orange-400" : "text-indigo-700 dark:text-indigo-400"
                              )}>
                                +{event.points} pts if you attend
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="text-[12px] text-gray-400">Free</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleSend(`How do I RSVP for ${event.title}?`); }}
                                  className="px-5 py-1.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors"
                                >
                                  RSVP
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className={cn(
                      "p-4 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-emerald-600 text-white rounded-tr-sm" 
                        : "bg-[#EAE6DB] dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200/30 dark:border-gray-800 rounded-tl-sm transition-colors"
                    )}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
              {msg.time && (
                <div className={cn("text-[11px] text-gray-400 font-medium px-1", msg.role === 'user' ? "text-right" : "text-left leading-none mt-2 block")}>
                   {msg.time}
                </div>
              )}
            </div>
          ))}

          <div ref={messageEndRef} />
          
          {/* Suggestions Header */}
          <div className="pt-4 pb-4">
             {messages[messages.length-1].role === 'ai' && messages[messages.length-1].text.includes("Tap any card") ? (
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
                 {['Show me more climate events', 'Weekend only', 'Who organizes these?'].map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(opt)}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-5 py-2.5 text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-500 whitespace-nowrap shadow-sm"
                    >
                      {opt}
                    </button>
                 ))}
               </div>
             ) : (
               <>
                 <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">You might also want to ask</h4>
                 <div className="space-y-2 pb-6">
                    {suggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(s.text)}
                        className={cn(
                          "w-full bg-white dark:bg-gray-900 border rounded-2xl p-4 flex items-center justify-between group transition-all text-left shadow-sm active:scale-[0.98]",
                          s.special 
                            ? "border-[#1A8D63] ring-1 ring-[#1A8D63] bg-[#EAF7F3]/30 dark:bg-emerald-900/10" 
                            : "border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                        )}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", s.color)}>
                            {s.icon}
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{s.text}</div>
                            <div className="text-[12px] text-gray-400 mt-1">{s.sub}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                      </button>
                    ))}
                 </div>
               </>
             )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="w-full bg-white dark:bg-gray-950 border-2 border-[#1A8D63] rounded-full px-6 py-4 pr-16 outline-none transition-all text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-medium"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 w-12 h-12 bg-[#1A8D63] rounded-full flex items-center justify-center text-white hover:bg-[#157250] transition-colors shadow-sm active:scale-90"
            >
              <Send className="w-5 h-5 -ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

