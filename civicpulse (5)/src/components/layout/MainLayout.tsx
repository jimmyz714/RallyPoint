import { Outlet, Navigate, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useStore } from "../../store/useStore";

export default function MainLayout() {
  const { user } = useStore();
  const location = useLocation();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[68px]">
        <Outlet />
      </div>
      
      {/* Fixed Navigation */}
      <BottomNav />
    </div>
  );
}
