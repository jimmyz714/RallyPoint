import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { X, Camera } from "lucide-react";
import { useStore } from "../../store/useStore";

interface EditProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileSheet({ isOpen, onClose }: EditProfileSheetProps) {
  const { user, updateUser } = useStore();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [status, setStatus] = useState(user.status || "");
  const [avatar, setAvatar] = useState(user.avatar || "");

  useEffect(() => {
    if (isOpen) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setStatus(user.status || "");
      setAvatar(user.avatar || "");
    }
  }, [isOpen, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    updateUser({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim(),
      status: status.trim() || 'Active now',
      avatar
    });
    onClose();
  };

  const currentInitials = `${firstName.charAt(0).toUpperCase() || ''}${lastName.charAt(0).toUpperCase() || ''}`;

  return (
    <div 
      className={cn(
        "absolute inset-0 z-50 flex justify-center items-end transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={onClose}
      />
      {/* Bottom Sheet Container */}
      <div 
        className={cn(
          "w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl relative flex flex-col transition-all duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 pb-soft-keyboard border-t border-gray-100 dark:border-gray-800",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 transition-colors">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
             <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-3xl font-bold overflow-hidden shadow-sm transition-colors">
               {avatar ? (
                 <img src={avatar} className="object-cover w-full h-full" alt="Avatar" />
               ) : (
                 currentInitials
               )}
             </div>
             <label className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all text-gray-600 dark:text-gray-300">
               <Camera className="w-4 h-4" />
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
             </label>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">First name</label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-gray-100"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Last name</label>
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-gray-100"
              placeholder="Your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Current Status</label>
            <input 
              type="text" 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-gray-100"
              placeholder="e.g. Active now, Cleaning up, Out at City Hall..."
              maxLength={40}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!firstName.trim() || !lastName.trim()}
          className="w-full py-3.5 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 dark:hover:bg-emerald-600 active:scale-[0.98] mb-safe-offset-4"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
