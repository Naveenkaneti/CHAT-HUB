import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLogout, HiOutlineUserAdd, HiOutlineUserCircle, HiChevronDown, HiOutlineCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '../Modals/LoginModal';

const Navbar = () => {
  const { user, accounts, logout, switchAccount } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 rounded-full transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <HiOutlineUserCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{user?.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{user?.email}</p>
            </div>
            <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden py-1"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Switch Account</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {accounts.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => {
                          switchAccount(acc.email);
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                          user?.email === acc.email 
                            ? 'bg-primary/5 border border-primary/10' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                          {acc.image ? (
                            <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                          ) : (
                            <HiOutlineUserCircle className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-xs font-bold truncate ${user?.email === acc.email ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
                        </div>
                        {user?.email === acc.email && <HiOutlineCheck className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-1">
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl"
                  >
                    <HiOutlineUserAdd className="w-5 h-5 text-slate-400" />
                    <span>Add Another Account</span>
                  </button>

                  <button 
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Sign Out Current</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Navbar;
