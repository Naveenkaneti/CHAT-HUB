import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, selectedChat, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 relative">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Select a conversation</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Choose a contact from the sidebar to start messaging and sharing files in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
