import React, { useState, useEffect } from 'react';
import { HiSearch, HiOutlineDotsVertical, HiOutlinePlusCircle, HiOutlineUserAdd, HiOutlineLogout, HiOutlineUserCircle, HiOutlineCheck, HiOutlineShieldCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI, chatAPI } from '../../services/api';
import LoginModal from '../Modals/LoginModal';

const Sidebar = () => {
  const { user, accounts, chats, setChats, setSelectedChat, selectedChat, logout, switchAccount } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data: chatsData } = await chatAPI.getChats();
        setChats(chatsData);
        
        const { data: usersData } = await authAPI.searchUsers('');
        setSuggestedUsers(usersData.slice(0, 5)); // Show first 5 users as suggestions
      } catch (error) {
        console.error("Error fetching initial data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [user, setChats]);

  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.searchUsers(query);
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users", error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const { data } = await chatAPI.accessChat(userId);
      
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      
      setSelectedChat(data);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error("Error accessing chat", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chatUsers) => {
    return chatUsers[0]._id === user._id ? chatUsers[1] : chatUsers[0];
  };

  const filteredChats = chats.filter(chat => {
    const chatName = chat.isGroupChat ? chat.chatName : getOtherUser(chat.users).name;
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 shadow-xl z-20">
      <div className="p-6 bg-gradient-to-br from-primary to-indigo-600">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">ChatHub</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <HiOutlineDotsVertical size={22} />
            </button>

            <AnimatePresence>
              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden py-1 border border-slate-200 dark:border-slate-800 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Accounts</p>
                    <div className="space-y-1.5">
                      {accounts.map((acc) => (
                        <button
                          key={acc.email}
                          onClick={() => {
                            switchAccount(acc.email);
                            setShowAccountMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                            user?.email === acc.email 
                              ? 'bg-primary/5 border border-primary/10' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <img src={acc.image} alt={acc.name} className="w-8 h-8 rounded-full border border-slate-200" />
                          <div className="flex-1 text-left min-w-0">
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
                    {user?.isAdmin && (
                      <button 
                        onClick={() => navigate('/admin')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors rounded-xl mb-1"
                      >
                        <HiOutlineShieldCheck className="w-5 h-5" />
                        <span className="font-bold">Admin Console</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowAccountMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl"
                    >
                      <HiOutlineUserAdd className="w-5 h-5 text-slate-400" />
                      <span className="font-semibold">Add Account</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-xl"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative group">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search messages or people..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border-none rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-2 space-y-1">
          {searchTerm && searchResults.length > 0 && (
            <div className="mb-4">
              <h4 className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Results</h4>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => accessChat(user._id)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/5 transition-all group"
                >
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{user.name}</h5>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))}
              <div className="h-px bg-slate-100 mx-3 my-2"></div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Loading chats...</div>
          ) : (
            <>
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group ${
                      selectedChat?._id === chat._id 
                        ? 'bg-primary shadow-lg shadow-primary/20' 
                        : 'hover:bg-primary/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                      {chat.isGroupChat ? (
                        <div className="grid grid-cols-2 gap-0.5 p-1">
                          {chat.users.slice(0, 4).map((u, i) => (
                            <img key={i} src={u.image} alt={u.name} className="w-full h-full object-cover rounded-full" />
                          ))}
                        </div>
                      ) : (
                        <img src={getOtherUser(chat.users).image} alt="Avatar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`text-sm font-bold truncate ${selectedChat?._id === chat._id ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                          {chat.isGroupChat ? chat.chatName : getOtherUser(chat.users).name}
                        </h4>
                        {chat.latestMessage && (
                          <span className={`text-[10px] ${selectedChat?._id === chat._id ? 'text-white/70' : 'text-slate-400'}`}>
                            {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${selectedChat?._id === chat._id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : !searchTerm && (
                <div className="py-8 px-4 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HiOutlinePlusCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">No conversations yet</p>
                </div>
              )}

              {!searchTerm && suggestedUsers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">People you may know</h4>
                  <div className="space-y-1">
                    {suggestedUsers.filter(u => !chats.find(c => !c.isGroupChat && c.users.find(cu => cu._id === u._id))).map((user) => (
                      <div
                        key={user._id}
                        onClick={() => accessChat(user._id)}
                        className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all group"
                      >
                        <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{user.name}</h5>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {!loading && filteredChats.length === 0 && searchTerm && (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              No conversations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
