import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import { ArrowLeft, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import AssistantSheet from "../components/ui/AssistantSheet";
import ParticipantsSheet from "../components/ui/ParticipantsSheet";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, user, toggleRsvp } = useStore();
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [isParticipantsOpen, setParticipantsOpen] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  const isRsvpd = user.rsvps.includes(event.id);

  const handleOrgClick = () => {
    if (event.orgId) {
      navigate(`/org/${event.orgId}`);
    } else {
      console.warn("No orgId found for this event:", event);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ea] dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-[#f4f2ea]/80 dark:bg-gray-950/80 backdrop-blur-md z-10 px-4 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
          <ArrowLeft className="w-5 h-5" />
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

      <div className="p-5">
        <div className="inline-block px-2.5 py-1 bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-md mb-4 uppercase tracking-wider border border-gray-100 dark:border-gray-800 transition-colors">
          {event.topic}
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
          {event.title}
        </h1>
        
        <button 
          onClick={handleOrgClick}
          className="w-full flex items-center gap-3 text-left text-gray-600 dark:text-gray-400 mb-6 border-b border-gray-200/50 dark:border-gray-800 pb-6 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-700 text-white flex flex-col items-center justify-center font-bold text-xs leading-none group-active:scale-95 transition-transform">
            {event.organization.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 underline decoration-emerald-200 dark:decoration-emerald-900 transition-all font-serif italic decoration-2 underline-offset-4">
              Hosted by {event.organization}
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); setParticipantsOpen(true); }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              <span className="font-bold text-gray-700 dark:text-gray-300 underline decoration-gray-200 dark:decoration-gray-700 underline-offset-2 decoration-2 group-hover:decoration-emerald-200">
                {event.attendees + (isRsvpd ? 1 : 0)} people
              </span> going
            </div>
          </div>
          <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-white dark:bg-gray-800 px-2 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-sm group-active:scale-95 transition-transform uppercase tracking-wider">
            View Org
          </div>
        </button>

        <div className="space-y-4 mb-8">
          <div className="flex gap-3 text-gray-900 dark:text-gray-200">
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
            <div className="text-[15px]">{event.dateStr}</div>
          </div>
          <div className="flex gap-3 text-gray-900 dark:text-gray-200">
            <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
            <div className="text-[15px]">{event.location}</div>
          </div>
          <div className="flex gap-3 text-gray-900 dark:text-gray-200">
            <Users className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
            <div className="text-[15px]">Open to the public</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">About this {event.type.toLowerCase()}</h2>
          <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="mt-auto px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky bottom-0 z-10 pb-safe-offset-4 transition-colors duration-300">
        <button 
          onClick={() => toggleRsvp(event.id)}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-lg",
            isRsvpd 
              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
              : "bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600"
          )}
        >
          {isRsvpd ? 'You are going!' : 'RSVP'}
        </button>
      </div>

      <AssistantSheet 
        isOpen={isAssistantOpen} 
        onClose={() => setAssistantOpen(false)} 
        contextMessage={`Tell me more about: ${event.title}`}
      />

      <ParticipantsSheet
        isOpen={isParticipantsOpen}
        onClose={() => setParticipantsOpen(false)}
        count={event.attendees + (isRsvpd ? 1 : 0)}
        eventTitle={event.title}
      />
    </div>
  );
}
