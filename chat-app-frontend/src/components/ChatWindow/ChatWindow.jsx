import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePhone, HiOutlineVideoCamera, HiOutlineDotsVertical, HiOutlinePaperClip, HiOutlineEmojiHappy, HiOutlinePaperAirplane } from 'react-icons/hi';
import MessageBubble from '../MessageBubble/MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';

const ChatWindow = ({ chat }) => {
  const { user, setChats } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const { socket, joinChat, sendMessage } = useSocket(user);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(chat?._id);

  // Use a ref to track current chat ID and prevent unnecessary fetches/flickering
  useEffect(() => {
    if (chat?._id && chatRef.current !== chat._id) {
      chatRef.current = chat._id;
      const fetchMessages = async () => {
        setLoading(true);
        try {
          const { data } = await chatAPI.getMessages(chat._id);
          setMessages(data);
          joinChat(chat._id);
        } catch (error) {
          console.error("Error fetching messages", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [chat?._id, joinChat]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessageReceived) => {
      if (chatRef.current === newMessageReceived.chat._id) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.find(m => m._id === newMessageReceived._id)) return prev;
          return [...prev, newMessageReceived];
        });
      }
    };

    socket.on('message received', handleNewMessage);
    return () => socket.off('message received', handleNewMessage);
  }, [socket]);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(messages.length <= 10 ? 'auto' : 'smooth');
    }
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isRocketLaunching) return;

    const messageContent = newMessage;
    setNewMessage('');
    setIsRocketLaunching(true);

    // Rocket animation timing
    setTimeout(async () => {
      try {
        const { data } = await chatAPI.sendMessage(chat._id, messageContent);
        sendMessage(data);
        setMessages((prev) => [...prev, data]);
        
        setChats(prev => prev.map(c => 
          c._id === chat._id ? { ...c, latestMessage: data } : c
        ));
      } catch (error) {
        console.error("Error sending message", error);
        setNewMessage(messageContent); // Restore on error
      } finally {
        setIsRocketLaunching(false);
      }
    }, 400);
  };

  const getOtherUser = () => {
    if (chat.isGroupChat) return null;
    return chat.users.find(u => u._id !== user._id);
  };

  const otherUser = getOtherUser();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Header with Gradient */}
      <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 p-0.5 shadow-lg">
              <img 
                src={chat.isGroupChat ? 'https://via.placeholder.com/150' : otherUser?.image} 
                alt={chat.chatName} 
                className="w-full h-full rounded-[14px] object-cover border-2 border-white dark:border-slate-900" 
              />
            </div>
            {otherUser?.status === 'online' && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
            )}
          </motion.div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">
              {chat.isGroupChat ? chat.chatName : otherUser?.name}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {chat.isGroupChat ? `${chat.users.length} members` : (otherUser?.status || 'Active now')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <HiOutlinePhone size={20} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <HiOutlineVideoCamera size={22} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <HiOutlineDotsVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Encrypted Messages</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} />
              ))}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Gradient Button */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 px-4 border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-900 shadow-inner transition-all">
            <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <HiOutlineEmojiHappy size={22} />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none py-3 px-2 text-sm focus:ring-0 text-slate-700 dark:text-slate-200"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <HiOutlinePaperClip size={22} />
            </button>
          </div>
          
          <motion.button 
            type="submit" 
            disabled={!newMessage.trim() || isRocketLaunching}
            animate={isRocketLaunching ? { 
              y: [-10, -100], 
              x: [0, 20],
              scale: [1, 0.5],
              opacity: [1, 0] 
            } : { y: 0, x: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
              newMessage.trim() 
              ? 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-primary/30 hover:shadow-primary/50' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}
          >
            <HiOutlinePaperAirplane size={24} className={isRocketLaunching ? 'rotate-45' : 'rotate-90'} />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
