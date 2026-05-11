import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiCamera, HiPencil, HiMoon, HiSun, HiLogout, HiChevronLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isDarkMode, toggleDarkMode, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Naveen Kumar',
    status: 'Avid coder and designer 🚀',
    email: user?.email || 'naveen@example.com'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/home" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <HiChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Profile Settings</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 p-1">
                <img src={user?.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform cursor-pointer">
                <HiCamera size={20} />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{profileData.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{profileData.email}</p>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                {isDarkMode ? <HiMoon size={20} className="text-primary" /> : <HiSun size={20} className="text-amber-500" />}
                <span className="font-semibold">Dark Mode</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 dark:text-white text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">About / Status</label>
                  <textarea 
                    name="status"
                    rows="3"
                    value={profileData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 dark:text-white text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                <HiLogout size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-slate-400 text-xs font-medium pb-8">
          Chat App v1.0.0 • Made with ❤️ by Naveen
        </p>
      </div>
    </div>
  );
};

export default Profile;
