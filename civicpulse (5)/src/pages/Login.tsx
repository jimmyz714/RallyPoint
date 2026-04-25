import { useState, FormEvent } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Rivera");
  const [email, setEmail] = useState("alex@email.com");
  const [password, setPassword] = useState("password123");
  
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleCreateAccount = (e: FormEvent) => {
    e.preventDefault();
    login(firstName, lastName, email);
    navigate("/onboarding");
  };

  return (
    <div className="flex-1 bg-[#F9F9F9] dark:bg-gray-950 flex flex-col items-center p-6 font-sans relative overflow-y-auto transition-colors duration-300">
      <div className="w-full mt-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-1">
          Civic<span className="text-emerald-500 dark:text-emerald-400">Pulse</span>
        </h1>
        
        <div className="flex gap-2 mb-8">
          <div className="h-1 flex-1 bg-emerald-400 rounded-full"></div>
          <div className="h-1 flex-1 bg-emerald-400 rounded-full"></div>
          <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">Create your account</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Join thousands of neighbors taking action on issues that matter in your community.
        </p>

        <form onSubmit={handleCreateAccount} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="submit"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl py-3.5 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition transition-colors"
            >
              Create account
            </button>
          </div>
          
          <div className="text-center text-sm pt-2 dark:text-gray-400">
            Already have an account? <button type="button" onClick={handleCreateAccount} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Sign in</button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-400 text-center leading-relaxed mt-8">
            By creating an account, you agree to our Terms of Service and Privacy Policy.<br/>
            Your data is never sold.
          </p>
        </form>
      </div>
    </div>
  );
}
