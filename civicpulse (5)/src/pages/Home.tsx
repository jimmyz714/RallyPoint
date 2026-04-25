import React, { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore, CivicEvent } from "../store/useStore";
import { cn } from "../lib/utils";
import AssistantSheet from "../components/ui/AssistantSheet";

const TAGS = ["All events", "City council", "Speaker series", "Local orgs", "Climate", "Labor", "Housing"];

function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    dragged.current = false;
    startX.current = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft.current = ref.current?.scrollLeft || 0;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 10) dragged.current = true;
    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.stopPropagation();
      e.preventDefault();
      dragged.current = false;
    }
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onClickCapture, className: "no-scrollbar cursor-grab active:cursor-grabbing" };
}

export default function Home() {
  const { user, events, toggleRsvp } = useStore();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState("All events");
  const [activeType, setActiveType] = useState<"All" | "Event" | "Opportunity">("All");
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const tagsScroll = useDraggableScroll();
  const featuredScroll = useDraggableScroll();

  const filteredEventsForTag = activeTag === "All events" 
    ? events 
    : events.filter(e => e.topic.toLowerCase() === activeTag.toLowerCase() || e.topic === activeTag);

  const filteredEvents = activeType === "All"
    ? filteredEventsForTag
    : filteredEventsForTag.filter(e => e.type === activeType);

  const featuredEvents = events.slice(0, 2);

  const getTagColor = (topic: string) => {
    switch (topic.toLowerCase()) {
      case 'speaker series': return 'bg-[#185346] dark:bg-emerald-800 text-white';
      case 'city council': return 'bg-[#1e4a86] dark:bg-blue-800 text-white';
      case 'local org': return 'bg-[#7a4b27] dark:bg-amber-900 text-white';
      case 'climate': return 'bg-[#e5f5f0] dark:bg-emerald-900/40 text-gray-800 dark:text-emerald-400';
      case 'labor': return 'bg-[#f8eedb] dark:bg-amber-900/40 text-gray-800 dark:text-amber-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getCardBg = (index: number) => {
    const bgs = ['bg-[#E6F5EF]', 'bg-[#EBF3FA]', 'bg-[#FDF3E3]'];
    return bgs[index % bgs.length];
  };

  const SidebarIndicator = ({ topic }: { topic: string }) => {
    switch (topic.toLowerCase()) {
      case 'climate': return <div className="w-1.5 self-stretch bg-emerald-600 rounded-l-xl"></div>;
      case 'city council': return <div className="w-1.5 self-stretch bg-blue-500 rounded-l-xl"></div>;
      case 'local org': return <div className="w-1.5 self-stretch bg-pink-500 rounded-l-xl"></div>;
      case 'labor': return <div className="w-1.5 self-stretch bg-yellow-500 rounded-l-xl"></div>;
      case 'speaker series': return <div className="w-1.5 self-stretch bg-purple-500 rounded-l-xl"></div>;
      default: return <div className="w-1.5 self-stretch bg-gray-400 rounded-l-xl"></div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f2ea] dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex justify-between items-center relative z-10 sticky top-0 bg-[#f4f2ea] dark:bg-gray-950 transition-colors duration-300">
        <div className="font-bold tracking-tight text-xl flex items-center gap-1 dark:text-white">
          Civic<span className="text-emerald-500 dark:text-emerald-400">Pulse</span>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => navigate("/profile")}
            className="w-[38px] h-[38px] rounded-full bg-[#e5eee9] dark:bg-emerald-900/40 flex items-center justify-center text-emerald-800 dark:text-emerald-300 text-xs font-bold leading-none border-2 border-white dark:border-gray-800 shadow-sm"
          >
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" /> : initials}
          </button>
          <button 
            onClick={() => setAssistantOpen(true)}
            className="w-[38px] h-[38px] border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-sm overflow-hidden"
          >
            <svg viewBox="0 0 100 100" className="w-[28px] h-[28px]">
              {/* Background Blue Bubble */}
              <g transform="translate(15, 5)">
                <rect x="25" y="5" width="55" height="42" rx="8" fill="#38B0F1" />
                <path d="M 65 47 L 75 62 L 75 47 Z" fill="#38B0F1" />
              </g>
              {/* Foreground Teal Bubble */}
              <g transform="translate(5, 25)">
                <rect x="0" y="0" width="58" height="44" rx="8" fill="#4BCB9F" />
                <path d="M 15 44 L 15 62 L 25 44 Z" fill="#4BCB9F" />
                {/* Dots */}
                <circle cx="15" cy="22" r="3.5" fill="white" />
                <circle cx="29" cy="22" r="3.5" fill="white" />
                <circle cx="43" cy="22" r="3.5" fill="white" />
              </g>
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 mt-4">
        <h2 className="text-[17px] text-gray-700 dark:text-gray-400 font-medium">Good morning, {user.firstName}</h2>
        <h1 className="text-[28px] font-serif font-bold text-gray-900 dark:text-white leading-tight transition-colors">What's happening near you</h1>
      </div>

      {/* Tags */}
      <div 
        className={cn("w-full overflow-x-auto select-none", tagsScroll.className)}
        ref={tagsScroll.ref}
        onMouseDown={tagsScroll.onMouseDown}
        onMouseLeave={tagsScroll.onMouseLeave}
        onMouseUp={tagsScroll.onMouseUp}
        onMouseMove={tagsScroll.onMouseMove}
        onClickCapture={tagsScroll.onClickCapture}
      >
        <div className="flex gap-2 px-5 mt-6 pb-1">
          {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activeTag === tag 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            )}
          >
            {tag}
          </button>
        ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-8">
        <h3 className="px-5 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Featured this week</h3>
        <div 
          className={cn("w-full overflow-x-auto select-none", featuredScroll.className)}
          ref={featuredScroll.ref}
          onMouseDown={featuredScroll.onMouseDown}
          onMouseLeave={featuredScroll.onMouseLeave}
          onMouseUp={featuredScroll.onMouseUp}
          onMouseMove={featuredScroll.onMouseMove}
          onClickCapture={featuredScroll.onClickCapture}
        >
          <div className="flex gap-4 px-5 pb-4">
            {featuredEvents.map((evt, idx) => {
            const isRsvpd = user.rsvps.includes(evt.id);
            return (
            <div 
              key={evt.id} 
              className={cn("w-[280px] shrink-0 rounded-2xl flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-300", getCardBg(idx), "dark:bg-gray-900")}
              onClick={() => navigate(`/event/${evt.id}`)}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            >
              <div className="p-4 flex-1">
                <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full inline-block mb-3", getTagColor(evt.topic))}>
                  {evt.topic}
                </span>
                <h4 className="font-medium text-[17px] text-gray-900 dark:text-gray-100 leading-tight mb-2">{evt.title}</h4>
                <div className="text-[13px] text-gray-600 dark:text-gray-400 mt-auto leading-relaxed">
                  <div>{evt.dateStr.split('·')[0].trim()} · {evt.dateStr.split('·')[1].trim()}</div>
                  <div className="truncate">{evt.location}</div>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between mt-auto bg-white dark:bg-gray-800 border-t border-gray-100/50 dark:border-gray-800 transition-colors duration-300">
                <div className="text-[13px] text-gray-500 dark:text-gray-400 font-medium pt-3">{evt.attendees + (isRsvpd ? 1 : 0)} going</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleRsvp(evt.id); }}
                  className={cn("px-5 py-1.5 border rounded-lg text-[13px] font-bold transition mt-3", isRsvpd ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700")}
                >
                  {isRsvpd ? 'RSVP\'D' : 'RSVP'}
                </button>
              </div>
            </div>
          )})}
          </div>
        </div>
      </div>

      {/* Upcoming Feed */}
      <div className="px-5 mt-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Upcoming Feed</h3>
          <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-lg">
            {(["All", "Event", "Opportunity"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-md transition-all",
                  activeType === type ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                {type === "All" ? "ALL" : type === "Event" ? "EVENTS" : "ROLES"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => {
              const isRsvpd = user.rsvps.includes(evt.id);
              return (
                <div 
                  key={evt.id} 
                  onClick={() => navigate(`/event/${evt.id}`)}
                  className="bg-white dark:bg-gray-900 rounded-xl flex border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}
                >
                  <SidebarIndicator topic={evt.topic} />
                  <div className="p-4 flex-1 flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h4 className="font-medium text-[15px] text-gray-900 dark:text-gray-100 leading-snug mb-1">{evt.title}</h4>
                      <div className="text-[13px] text-gray-600 dark:text-gray-400 mb-0.5">
                        {evt.dateStr} &nbsp;&nbsp; {evt.location}
                      </div>
                      <div className="text-[12px] text-gray-500 dark:text-gray-400">
                        {evt.type === 'Event' ? 'Hosted by ' : 'Volunteers for '}{evt.organization} · {evt.attendees + (isRsvpd ? 1 : 0)} attending
                      </div>
                    </div>
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0", getTagColor(evt.topic))}>
                      {evt.topic}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white/50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No items found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      <AssistantSheet isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
