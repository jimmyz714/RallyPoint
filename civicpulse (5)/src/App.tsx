/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { cn } from "./lib/utils";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import OrganizationProfile from "./pages/OrganizationProfile";

import { useStore } from "./store/useStore";

// Global wrapper to simulate a mobile frame on desktop
function AppContainer() {
  const { theme } = useStore();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className={cn(
      "min-h-screen bg-gray-200 md:bg-gray-100 flex justify-center items-center md:py-8 transition-colors duration-300",
      theme === 'dark' ? "dark md:bg-gray-950 bg-gray-950" : ""
    )}>
      {/* The "Phone" Frame */}
      <div className="w-full h-screen md:h-[844px] md:max-w-[390px] bg-white dark:bg-gray-900 md:rounded-[3rem] md:shadow-2xl md:ring-8 md:ring-gray-900 dark:md:ring-gray-800 overflow-hidden relative flex flex-col transition-colors duration-300">
        {/* Mock Status Bar (Desktop only) */}
        <div className="hidden md:flex px-8 pt-4 pb-2 justify-between items-center text-[10px] font-bold text-gray-900 dark:text-gray-100 select-none">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-2 rounded-[2px] border border-gray-900 dark:border-gray-100"></div>
            <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-gray-100"></div>
          </div>
        </div>
        
        {/* App Content */}
        <div className={cn("flex-1 overflow-hidden relative flex flex-col", theme === 'dark' ? "dark" : "")}>
          <Outlet />
        </div>

        {/* Home Indicator (Desktop only) */}
        <div className="hidden md:flex justify-center pb-2">
          <div className="w-32 h-1 bg-gray-900/10 dark:bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppContainer />}>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/org/:id" element={<OrganizationProfile />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
