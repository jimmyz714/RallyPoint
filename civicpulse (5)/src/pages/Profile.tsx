import { useState } from "react";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { Sun, Moon } from "lucide-react";
import ChallengeSheet from "../components/ui/ChallengeSheet";
import EditProfileSheet from "../components/ui/EditProfileSheet";
import { useDraggableScroll } from "../hooks/useDraggableScroll";

type Tab = "Overview" | "Records" | "Friends";

export default function Profile() {
  const { user, logout, theme, toggleTheme } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const badgeScrollProps = useDraggableScroll();
  const challengeScrollProps = useDraggableScroll();

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  
  // Simple rank calculation similar to Leaderboard
  const rank = user.points > 1200 ? 1 : 253; 

  const friends = [
    { id: '1', name: "Maya R.", pts: 1240, rank: 1, init: "MR" },
    { id: '2', name: "Jordan T.", pts: 1180, rank: 2, init: "JT" },
    { id: '4', name: "StarSpangledChic", pts: 135786, rank: 4, init: "SC" },
    { id: '5', name: "BigAppleExplorer", pts: 25796, rank: 5, init: "BA" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f2ea] dark:bg-gray-950 overflow-x-hidden pb-16 transition-colors duration-300">
      
      {/* Header Profile Info */}
      <div className="bg-[#189F6B] dark:bg-emerald-900 text-white pt-10 pb-4 px-6 rounded-b-[2rem] relative transition-colors duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-[68px] h-[68px] bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-[#189F6B] dark:text-emerald-400 text-2xl font-bold relative shadow-sm overflow-hidden border-2 border-white dark:border-gray-700">
              {user.avatar ? (
                <img src={user.avatar} className="object-cover w-full h-full" alt="Avatar" />
              ) : (
                initials
              )}
              <button 
                onClick={() => setIsEditingProfile(true)} 
                className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-90 transition-transform"
              >
                <span className="text-[10px]">✏️</span>
              </button>
            </div>
            <div>
              <h1 className="text-[22px] font-serif font-bold leading-tight">{user.firstName} {user.lastName}</h1>
              <p className="text-emerald-100 dark:text-emerald-200 text-[13px] mt-0.5">Berkeley · Joined Jan 2026</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="bg-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400">
              Lv 4
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white border border-white/20"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-6 mt-2 mb-2 font-medium">
          <div>
            <div className="text-[20px] font-bold leading-none">{rank}</div>
            <div className="text-emerald-100 text-[11px] mt-1">Rank</div>
          </div>
          <div>
            <div className="text-[20px] font-bold leading-none">{user.points.toLocaleString()}</div>
            <div className="text-emerald-100 text-[11px] mt-1">Pulse Credit</div>
          </div>
          <div>
            <div className="text-[20px] font-bold leading-none">41</div>
            <div className="text-emerald-100 text-[11px] mt-1">Events</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 mt-2">
        {(["Overview", "Records", "Friends"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-4 text-[14px] font-medium border-b-2 transition-colors",
              activeTab === tab 
                ? "border-[#189F6B] dark:border-emerald-500 text-[#189F6B] dark:text-emerald-500" 
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1">
        
        {activeTab === "Overview" && (
          <div className="transition-opacity duration-300">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Activity & Status</h3>
            <div className="space-y-3 mb-8">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="relative mr-4">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="flex-1 font-medium text-[15px] text-gray-900 dark:text-gray-100">{user.status || 'Active now'}</div>
                <span className="text-emerald-600 dark:text-emerald-400 text-[13px] font-medium font-serif italic">Online</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                </div>
                <div className="flex-1 font-medium text-[15px] text-gray-900 dark:text-gray-100">Last action</div>
                <span className="text-gray-500 dark:text-gray-400 text-[13px]">Joined cleanup · 2h ago</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Current Challenges</h3>
            <div className="space-y-3 mb-8">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mr-3 shrink-0">📍</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900 dark:text-gray-100 italic transition-all">Attend 1 city meeting</div>
                  <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-light">0 / 1 completed</div>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[15px]">+40 pts</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mr-3 shrink-0">👥</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900 dark:text-gray-100 italic transition-all">Invite 1 friend</div>
                  <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-light">0 / 1 completed</div>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[15px]">+50 pts</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mr-3 shrink-0">📝</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900 dark:text-gray-100 italic transition-all">Comment on 2 local bills</div>
                  <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-light">1 / 2 completed</div>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[15px]">+20 pts</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center shadow-sm transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mr-3 shrink-0">🤝</div>
                <div className="flex-1">
                  <div className="font-medium text-[15px] text-gray-900 dark:text-gray-100 italic transition-all">Attend 1 volunteering event</div>
                  <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-light">0 / 1 completed</div>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[15px]">+80 pts</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Local Challenges</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 -mt-2 mb-4 font-light">
              Time-limited · Earn badges & recognition 
              <span 
                onClick={() => setActiveTab("Records")}
                className="float-right text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                See all →
              </span>
            </p>
            <div 
              className={cn("flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 select-none", challengeScrollProps.className)}
              ref={challengeScrollProps.ref}
              onMouseDown={challengeScrollProps.onMouseDown}
              onMouseLeave={challengeScrollProps.onMouseLeave}
              onMouseUp={challengeScrollProps.onMouseUp}
              onMouseMove={challengeScrollProps.onMouseMove}
              onClickCapture={challengeScrollProps.onClickCapture}
            >
              {/* Challenge 1 */}
              <div className="min-w-[280px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden shrink-0 transition-colors duration-300">
                <div className="h-24 bg-emerald-600 dark:bg-emerald-800 p-4 relative flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">9 days left</span>
                  </div>
                  <div className="text-4xl">🌱</div>
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl">🥇</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 italic transition-all">East Bay Climate Coalition</div>
                  <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">Spring Climate Sprint</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ends May 3 · +200 pts + badge</div>
                  <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/3"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">1 / 3 events done</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🏅 Sprout Badge</span>
                  </div>
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="min-w-[280px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden shrink-0 transition-colors duration-300">
                <div className="h-24 bg-[#1e4e8c] dark:bg-blue-900 p-4 relative flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">4 days left</span>
                  </div>
                  <div className="text-4xl text-white">🏛️</div>
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl">🎖️</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 italic transition-all">Berkeley City Council</div>
                  <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">April Civic Voice Challenge</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ends Apr 30 · +150 pts + badge</div>
                  <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-0"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">0 / 2 events done</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">🏅 Civic Voice</span>
                  </div>
                </div>
              </div>

              {/* Challenge 3: Neighbor Up May Challenge */}
              <div className="min-w-[280px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden shrink-0 transition-colors duration-300">
                <div className="h-24 bg-gradient-to-br from-[#8a4a00] to-[#ffa500] p-4 relative flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">21 days left</span>
                  </div>
                  <div className="text-4xl text-white drop-shadow-md">🍊</div>
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg">⭐</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 italic transition-all">Oakland Resilience Network</div>
                  <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100">Neighbor Up May Challenge</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ends May 15 · +250 pts + badge</div>
                  <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-0"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">0 / 4 events done</span>
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">🏅 Neighbor Star</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Badges Earned</h3>
            <div 
              className={cn("flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 select-none", badgeScrollProps.className)}
              ref={badgeScrollProps.ref}
              onMouseDown={badgeScrollProps.onMouseDown}
              onMouseLeave={badgeScrollProps.onMouseLeave}
              onMouseUp={badgeScrollProps.onMouseUp}
              onMouseMove={badgeScrollProps.onMouseMove}
              onClickCapture={badgeScrollProps.onClickCapture}
            >
              {[
                { 
                  name: 'Labor Champion', 
                  id: 'labor',
                  render: () => (
                    <svg viewBox="0 0 200 200" className="w-12 h-12 drop-shadow-sm">
                      <g fill="#F2B041">
                        <rect x="82" y="4" width="36" height="192" rx="5" />
                        <rect x="82" y="4" width="36" height="192" rx="5" transform="rotate(45 100 100)" />
                        <rect x="82" y="4" width="36" height="192" rx="5" transform="rotate(90 100 100)" />
                        <rect x="82" y="4" width="36" height="192" rx="5" transform="rotate(135 100 100)" />
                        <circle cx="100" cy="100" r="76" />
                      </g>
                      <circle cx="100" cy="100" r="66" fill="#FFFFFF" />
                      <clipPath id="app-logo-clip-engineering">
                        <circle cx="100" cy="100" r="66" />
                      </clipPath>
                      <g clipPath="url(#app-logo-clip-engineering)">
                        <path d="M -5 200 C 5 130, 20 108, 42 108 C 55 108, 65 120, 65 200 Z" fill="#68717A" />
                        <ellipse cx="42" cy="98" rx="15" ry="16" fill="#68717A" />
                        <path d="M 27 94 C 27 72, 57 72, 57 94 Z" fill="#F2B041" />
                        <path d="M 21 94 Q 42 85 63 94 L 65 98 Q 42 90 19 98 Z" fill="#F2B041" />
                        <path d="M 205 200 C 195 130, 180 108, 158 108 C 145 108, 135 120, 135 200 Z" fill="#68717A" />
                        <ellipse cx="158" cy="98" rx="15" ry="16" fill="#68717A" />
                        <path d="M 143 94 C 143 72, 173 72, 173 94 Z" fill="#F2B041" />
                        <path d="M 137 94 Q 158 85 179 94 L 181 98 Q 158 90 135 98 Z" fill="#F2B041" />
                        <path d="M 100 105 C 85 90, 60 55, 35 20 L 20 30 C 50 70, 65 120, 68 200 L 132 200 C 135 120, 150 70, 180 30 L 165 20 C 140 55, 115 90, 100 105 Z" fill="#68717A" stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" />
                        <ellipse cx="100" cy="62" rx="17" ry="18" fill="#68717A" />
                        <path d="M 81 56 C 81 30, 119 30, 119 56 Z" fill="#F2B041" />
                        <path d="M 73 56 Q 100 45 127 56 L 130 61 Q 100 51 70 61 Z" fill="#F2B041" />
                      </g>
                    </svg>
                  )
                },
                { 
                  name: 'Civic Star', 
                  id: 'star',
                  render: () => (
                    <svg viewBox="-15 -15 230 230" className="w-12 h-12 drop-shadow-sm">
                      <circle cx="100" cy="100" r="85" fill="#F8D364" />
                      <g fill="#F8D364">
                        <circle cx="100" cy="15" r="24" />
                        <circle cx="100" cy="15" r="24" transform="rotate(30 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(60 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(90 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(120 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(150 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(180 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(210 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(240 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(270 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(300 100 100)" />
                        <circle cx="100" cy="15" r="24" transform="rotate(330 100 100)" />
                      </g>
                      <circle cx="100" cy="100" r="72" fill="#E25454" />
                      <circle cx="100" cy="100" r="56" fill="#C43434" stroke="#B02C2C" strokeWidth="2" />
                      <polygon points="100,68 109.4,86.8 130.4,89.9 114.2,105.7 118.8,126.1 100,116.2 81.2,126.1 85.8,105.7 69.6,89.9 90.6,86.8" fill="#D9B54A" stroke="#D9B54A" strokeWidth="4" strokeLinejoin="round" transform="translate(0, 5)" />
                      <polygon points="100,68 109.4,86.8 130.4,89.9 114.2,105.7 118.8,126.1 100,116.2 81.2,126.1 85.8,105.7 69.6,89.9 90.6,86.8" fill="#FCE77D" stroke="#FCE77D" strokeWidth="4" strokeLinejoin="round" />
                    </svg>
                  )
                },
                { 
                  name: 'Safety Guardian', 
                  id: 'security',
                  render: () => (
                    <svg viewBox="0 0 200 200" className="w-12 h-12 drop-shadow-2xl">
                      <defs>
                        <linearGradient id="app-shield-goldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#E6C25B" />
                          <stop offset="30%" stopColor="#FFF5B8" />
                          <stop offset="70%" stopColor="#B38B22" />
                          <stop offset="100%" stopColor="#FFF5B8" />
                        </linearGradient>
                        <linearGradient id="app-shield-goldInner" x1="100%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#997012" />
                          <stop offset="40%" stopColor="#FCE17A" />
                          <stop offset="100%" stopColor="#805C07" />
                        </linearGradient>
                        <linearGradient id="app-shield-goldCore" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#E8C560" />
                          <stop offset="50%" stopColor="#F2D780" />
                          <stop offset="100%" stopColor="#C29A29" />
                        </linearGradient>
                        <linearGradient id="app-shield-darkCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#344154" />
                          <stop offset="50%" stopColor="#1D2633" />
                          <stop offset="100%" stopColor="#0A0F14" />
                        </linearGradient>
                        <path id="app-shield-text-arc" d="M 20 85 Q 100 30 180 85" fill="none" />
                      </defs>
                      <path d="M 100 15 Q 140 35 180 20 Q 185 80 180 110 C 170 160 140 185 100 195 C 60 185 30 160 20 110 Q 15 80 20 20 Q 60 35 100 15 Z" fill="url(#app-shield-goldOuter)" />
                      <path d="M 100 23 Q 137 41 170 28 Q 174 80 170 107 C 161 152 135 175 100 184 C 65 175 39 152 30 107 Q 26 80 30 28 Q 63 41 100 23 Z" fill="url(#app-shield-goldInner)" />
                      <path d="M 100 30 Q 134 47 162 36 Q 165 80 162 104 C 154 145 130 166 100 174 C 70 166 46 145 38 104 Q 35 80 38 36 Q 66 47 100 30 Z" fill="url(#app-shield-goldCore)" />
                      <circle cx="100" cy="115" r="45" fill="url(#app-shield-darkCenter)" stroke="#8C6A1A" strokeWidth="2.5" />
                      <text fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20" letterSpacing="1.5">
                        <textPath href="#app-shield-text-arc" startOffset="50%" textAnchor="middle" fill="#1A1A1A" stroke="#E6C25B" strokeWidth="1.2">SECURITY</textPath>
                      </text>
                      <polygon points="100,115 100,80 91.8,98.7" fill="#FFF4C2" />
                      <polygon points="100,115 66.7,105.8 91.8,98.7" fill="#FFF4C2" />
                      <polygon points="100,115 79.4,143.3 86.7,119.9" fill="#FFF4C2" />
                      <polygon points="100,115 100,80 108.2,98.7" fill="#E0B843" />
                      <polygon points="100,115 86.7,119.9 66.7,105.8" fill="#E0B843" />
                      <polygon points="100,115 100,126.2 79.4,143.3" fill="#E0B843" />
                      <polygon points="100,115 108.2,98.7 133.3,105.8" fill="#B38B22" />
                      <polygon points="100,115 113.3,119.9 120.6,143.3" fill="#B38B22" />
                      <polygon points="100,115 133.3,105.8 113.3,119.9" fill="#6A4D0F" />
                      <polygon points="100,115 120.6,143.3 100,126.2" fill="#6A4D0F" />
                    </svg>
                  )
                },
                { 
                  name: 'Top 100', 
                  id: 'rank',
                  render: () => (
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl shadow-inner border border-orange-200 dark:border-orange-800 transition-colors">🏆</div>
                  )
                },
                { 
                  name: 'City Voice', 
                  id: 'voice',
                  render: () => (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl shadow-inner border border-blue-200 dark:border-blue-800 transition-colors">📣</div>
                  )
                },
                { 
                  name: 'Climate Ally', 
                  id: 'climate',
                  render: () => (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl shadow-inner border border-emerald-200 dark:border-emerald-800 transition-colors">🌱</div>
                  )
                },
              ].map(b => (
                <div key={b.id} className="w-[100px] h-[108px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center shadow-sm shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <div className="mb-2">
                    {b.render()}
                  </div>
                  <div className="text-[11px] font-bold text-gray-700 dark:text-gray-200 px-1 text-center leading-tight">{b.name}</div>
                </div>
              ))}
              <div className="w-2 shrink-0 h-full" aria-hidden="true" />
            </div>

            <div className="mt-12 mb-8">
              <button 
                onClick={logout}
                className="w-full py-3 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === "Records" && (
          <div className="transition-opacity duration-300">
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Your Stats</h3>
             <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                 <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">41</div>
                 <div className="text-[13px] text-gray-600 dark:text-gray-400">Events attended</div>
               </div>
               <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                 <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">5,356</div>
                 <div className="text-[13px] text-gray-600 dark:text-gray-400">Total points</div>
               </div>
               <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">12</div>
                 <div className="text-[13px] text-gray-600 dark:text-gray-400">Council meetings</div>
               </div>
               <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">8</div>
                 <div className="text-[13px] text-gray-600 dark:text-gray-400">Speaker series</div>
               </div>
             </div>

             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Topic Breakdown</h3>
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700 dark:text-gray-300">Climate</span><span className="text-gray-500 dark:text-gray-400">18 events</span></div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden transition-colors"><div className="h-full bg-emerald-500 rounded-full" style={{width: '65%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700 dark:text-gray-300">City council</span><span className="text-gray-500 dark:text-gray-400">12 events</span></div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden transition-colors"><div className="h-full bg-blue-500 rounded-full" style={{width: '45%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700 dark:text-gray-300">Labor & wages</span><span className="text-gray-500 dark:text-gray-400">7 events</span></div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden transition-colors"><div className="h-full bg-orange-400 rounded-full" style={{width: '25%'}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700 dark:text-gray-300">Housing</span><span className="text-gray-500 dark:text-gray-400">4 events</span></div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden transition-colors"><div className="h-full bg-pink-500 rounded-full" style={{width: '15%'}}></div></div>
               </div>
             </div>
          </div>
        )}

        {activeTab === "Friends" && (
          <div className="transition-opacity duration-300">
            <button 
              onClick={() => setChallengeTarget("All Friends")}
              className="w-full py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-gray-900 dark:text-gray-100 shadow-sm mb-6 flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="text-gray-400 dark:text-gray-500">⚡</span> Challenge all friends
            </button>

            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Your Friends</h3>
            <div className="space-y-3">
              {friends.map(f => (
                <div key={f.id} className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center mr-3 border border-orange-100 dark:border-orange-900 transition-colors">
                      {f.init}
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-gray-900 dark:text-gray-100 transition-colors uppercase">{f.name}</div>
                      <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">{f.pts.toLocaleString()} pts · Rank #{f.rank}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setChallengeTarget(f.name)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ChallengeSheet 
        isOpen={!!challengeTarget} 
        onClose={() => setChallengeTarget(null)}
        friendName={challengeTarget || ""} 
      />

      <EditProfileSheet 
        isOpen={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)} 
      />
    </div>
  );
}
