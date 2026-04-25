import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";

const TIME_FILTERS = ["Today", "This week", "All time"];
const AREA_FILTERS = ["Berkeley", "Oakland", "Fremont", "All areas"];

const mockLeaderboard = [
  { id: '1', name: "Maya R.", init: "MR", pts: 1240, events: 12, rank: 1, isMe: false },
  { id: '2', name: "Jordan T.", init: "JT", pts: 1180, events: 10, rank: 2, isMe: false },
  { id: '3', name: "", init: "AR", pts: 1115, events: 8, rank: 3, isMe: true },
  { id: '4', name: "StarSpangledChic", init: "SC", pts: 890, events: 4, rank: 4, isMe: false },
  { id: '5', name: "BigAppleExplorer", init: "BA", pts: 720, events: 3, rank: 5, isMe: false },
  { id: '6', name: "LoneStarRider", init: "LS", pts: 650, events: 2, rank: 6, isMe: false },
  { id: '7', name: "LibertyLover88", init: "LL", pts: 540, events: 2, rank: 7, isMe: false },
  { id: '8', name: "BerkeleyBlaze", init: "BB", pts: 420, events: 2, rank: 8, isMe: false },
];

function CountdownTimer({ area }: { area: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Generate a deterministic target date based on area
    const now = new Date().getTime();
    let daysToAdd = 3;
    if (area === "Oakland") daysToAdd = 5;
    else if (area === "Fremont") daysToAdd = 2;
    else if (area === "All areas") daysToAdd = 14;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    targetDate.setHours(0, 0, 0, 0);
    const target = targetDate.getTime();

    const interval = setInterval(() => {
      const current = new Date().getTime();
      const distance = target - current;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [area]);

  const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-lg font-bold text-emerald-400">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[8px] uppercase tracking-wider text-gray-400 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-[#0c1a14] dark:bg-black rounded-2xl p-4 flex items-center justify-between shadow-xl border border-white/5 mx-4 mt-2">
      <div className="text-left">
        <div className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/80 font-bold mb-1">Season 3 · Spring 2026</div>
        <div className="text-white text-lg font-bold">Resets in</div>
      </div>
      <div className="flex items-center gap-1.5">
        <TimeBox value={timeLeft.days} label="Days" />
        <span className="text-emerald-500 font-bold mb-4">:</span>
        <TimeBox value={timeLeft.hours} label="Hrs" />
        <span className="text-emerald-500 font-bold mb-4">:</span>
        <TimeBox value={timeLeft.minutes} label="Min" />
        <span className="text-emerald-500 font-bold mb-4">:</span>
        <TimeBox value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [activeTime, setActiveTime] = useState("Today");
  const [activeArea, setActiveArea] = useState("Berkeley");

  const displayLeaderboard = useMemo(() => {
    const timeMultiplier = activeTime === "Today" ? 1 : activeTime === "This week" ? 4.5 : 24.5;
    const areaSeed = activeArea.charCodeAt(0) + activeArea.length;
    
    let list = mockLeaderboard.map((u) => {
      // Create a unique seed based on both Area and Time to ensure different scrambles
      const areaSeed = activeArea.charCodeAt(0) + activeArea.length;
      const timeSeed = activeTime.charCodeAt(0) * activeTime.length;
      const combinedSeed = areaSeed + timeSeed + parseInt(u.id);
      
      // Deterministic randomness (0.5 to 1.5)
      const pseudoRand = ((combinedSeed * 13) % 10) / 10 + 0.5;
      
      let pts = Math.floor(u.pts * timeMultiplier * pseudoRand);
      let init = u.init;
      let name = u.name;
      
      if (u.isMe) {
        // User is strong in Berkeley Today, but maybe not All Time everywhere
        let powerFactor = 0.5;
        if (activeArea === "Berkeley" && activeTime === "Today") powerFactor = 1.3;
        else if (activeArea === "Berkeley") powerFactor = 0.9;
        else if (activeArea === "All areas") powerFactor = 0.7;
        
        // Scale user points
        pts = Math.floor(1200 * timeMultiplier * powerFactor * pseudoRand);
        init = `${user.firstName.charAt(0) || ''}${user.lastName.charAt(0) || ''}`;
      } else {
        // Dynamic Regional/Time Champions
        if (activeArea === "Oakland" && u.id === "1") {
          name = activeTime === "All time" ? "James " + "S.".repeat(activeTime.length % 2 + 1) : "James S.";
          init = "JS";
          pts = Math.floor(pts * 1.5);
        } else if (activeArea === "Fremont" && u.id === "2") {
          name = "Lydia G.";
          init = "LG";
          pts = Math.floor(pts * 1.6);
        } else if (activeTime === "All time" && u.id === "4") {
          // Special veteran for all time
          name = "Elder Citizen";
          init = "EC";
          pts = Math.floor(pts * 1.8);
        }
      }
      
      return { ...u, pts, init, name };
    });

    list.sort((a, b) => b.pts - a.pts);
    return list.map((u, i) => ({ 
      ...u, 
      rank: i + 1, 
      name: u.isMe ? "You" : u.name, 
      avatar: u.isMe ? user.avatar : undefined 
    }));
  }, [activeTime, activeArea, user.points, user.firstName, user.lastName, user.avatar]);

  const topThree = displayLeaderboard.slice(0, 3);
  const theRest = displayLeaderboard.slice(3);
  const meEntry = displayLeaderboard.find(u => u.isMe);
  const myRank = meEntry?.rank || "253";
  const myPoints = meEntry?.pts || user.points;

  return (
    <div className="flex flex-col h-full bg-[#f4f2ea] dark:bg-gray-950 overflow-hidden relative transition-colors duration-300">
      <div className="px-5 pt-8 pb-4 text-center border-b border-gray-100 dark:border-gray-800 bg-[#f4f2ea] dark:bg-gray-950 shrink-0 transition-colors duration-300">
        <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">Leaderboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 bg-[#f4f2ea] dark:bg-gray-950 space-y-4">
          {/* Time Filters */}
          <div className="flex gap-2">
            {TIME_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveTime(f)}
                className={cn(
                  "flex-1 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  activeTime === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Area Filters */}
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pb-1">
              {AREA_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveArea(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-medium border transition-colors whitespace-nowrap",
                    activeArea === f ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer area={activeArea} />

        {/* Podium */}
        <div className="px-5 py-8 flex justify-center items-end gap-3 bg-[#f4f2ea] dark:bg-gray-950 mt-2 transition-colors duration-300">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 border overflow-hidden", topThree[1]?.isMe ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-500" : "bg-blue-50 dark:bg-blue-900/30 text-blue-500 border-blue-100 dark:border-blue-800")}>
              {topThree[1]?.avatar ? <img src={topThree[1].avatar} className="w-full h-full object-cover" alt="" /> : topThree[1]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[1]?.isMe ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>{topThree[1]?.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{topThree[1]?.pts.toLocaleString()} pts</div>
            <div className="w-[85px] h-[70px] bg-[#53C594] dark:bg-emerald-600 rounded-t-lg flex items-center justify-center text-white font-bold text-2xl">2</div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="text-xl mb-1 flex items-center justify-center motion-safe:animate-bounce">👑</div>
            <div className={cn("w-[68px] h-[68px] rounded-full flex items-center justify-center font-bold text-2xl mb-2 border-2 relative overflow-hidden", topThree[0]?.isMe ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-500" : "bg-orange-50 dark:bg-orange-900/30 text-orange-600 border-orange-200 dark:border-orange-800")}>
              {topThree[0]?.avatar ? <img src={topThree[0].avatar} className="w-full h-full object-cover" alt="" /> : topThree[0]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[0]?.isMe ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>{topThree[0]?.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{topThree[0]?.pts.toLocaleString()} pts</div>
            <div className="w-24 h-[100px] bg-[#F4A836] dark:bg-orange-600 rounded-t-lg flex items-center justify-center text-white font-bold text-3xl">1</div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-2 border overflow-hidden", topThree[2]?.isMe ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-500" : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 border-purple-100 dark:border-purple-800")}>
              {topThree[2]?.avatar ? <img src={topThree[2].avatar} className="w-full h-full object-cover" alt="" /> : topThree[2]?.init}
            </div>
            <div className={cn("text-xs font-bold", topThree[2]?.isMe ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>{topThree[2]?.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{topThree[2]?.pts.toLocaleString()} pts</div>
            <div className="w-[85px] h-[55px] bg-[#3B82F6] dark:bg-blue-600 rounded-t-lg flex items-center justify-center text-white font-bold text-2xl">3</div>
          </div>
        </div>

        {/* List */}
        <div className="bg-[#f4f2ea] dark:bg-gray-950 px-4 pt-4 pb-32 transition-colors duration-300">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            <span>Rank</span>
            <span>Points</span>
          </div>
          
          <div className="space-y-2 relative">
            {theRest.map(u => (
              <div key={u.id} className={cn("bg-white dark:bg-gray-900 p-3 rounded-xl flex items-center border shadow-sm transition-all duration-300", u.isMe ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10" : "border-gray-100 dark:border-gray-800")}>
                <span className="w-6 text-center text-sm font-bold text-gray-400">{u.rank}</span>
                <div className={cn("w-10 h-10 rounded-full font-bold flex items-center justify-center ml-3 mr-3 text-sm overflow-hidden", u.isMe ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400")}>
                  {u.avatar ? <img src={u.avatar} className="object-cover w-full h-full" alt="" /> : u.init}
                </div>
                <div className="flex-1">
                  <div className={cn("font-bold text-sm", u.isMe ? "text-emerald-800 dark:text-emerald-200" : "text-gray-900 dark:text-gray-100")}>{u.name}</div>
                  <div className="flex gap-1 mt-0.5">
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 rounded">{u.events} events</span>
                    {u.rank % 2 === 0 && <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 rounded">council</span>}
                  </div>
                </div>
                <div className={cn("font-bold text-[15px]", u.isMe ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>
                  {u.pts.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Me Bar */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
        <button 
          onClick={() => navigate('/profile')}
          className="w-full bg-emerald-600 dark:bg-emerald-700 rounded-xl p-3 flex items-center text-white shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
        >
          <div className="text-lg font-bold w-10 text-center">{myRank}</div>
          <div className="flex-1 ml-2 text-left">
            <div className="font-bold">🔥 You — {user.firstName} {user.lastName.charAt(0)}.</div>
            <div className="text-emerald-100 dark:text-emerald-200 text-[11px]">+120 pts today</div>
          </div>
          <div className="font-bold text-lg mr-3">{myPoints.toLocaleString()}</div>
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs shrink-0">▶</div>
        </button>
      </div>
    </div>
  );
}
