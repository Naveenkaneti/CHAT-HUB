import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isMe = message.sender._id === user._id;

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8, rotate: isMe ? -5 : 5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.4 
      }}
      className={`flex w-full mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] md:max-w-[70%] lg:max-w-[60%] items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isMe && (
          <div className="w-6 h-6 rounded-full bg-slate-300 flex-shrink-0 mb-1 overflow-hidden border border-slate-200">
            <img src={message.sender.image} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex flex-col">
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm shadow-md relative group transition-all ${
              isMe
                ? 'bg-gradient-to-br from-primary to-indigo-600 text-white rounded-br-none'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
            }`}
          >
            {message.content}
          </div>
          
          <span className={`text-[10px] text-slate-400 font-medium mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
