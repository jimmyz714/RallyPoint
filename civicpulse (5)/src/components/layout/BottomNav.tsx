import { NavLink } from "react-router-dom";
import { Home, BarChart2, User } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BottomNav() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/leaderboard", icon: BarChart2, label: "Leaderboard" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-pb flex transition-colors duration-300">
      {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium border-r border-gray-100 dark:border-gray-800 last:border-r-0 active:scale-[0.95] transition-all",
                isActive ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5px]" : "stroke-2")}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
    </div>
  );
}
