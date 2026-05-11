import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { HiOutlineTrash, HiOutlineUserGroup, HiOutlineShieldCheck, HiArrowLeft } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await authAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await authAPI.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/home')}
              className="p-3 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all"
            >
              <HiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Admin Console</h1>
              <p className="text-slate-500 font-medium">Manage your community and platform users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-2xl font-black text-primary">{users.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Users</p>
            </div>
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
              <HiOutlineShieldCheck size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={user.image} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                              {user.name}
                              {user.isAdmin && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] rounded-full uppercase tracking-tighter">Admin</span>}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.status || 'Offline'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {!user.isAdmin && (
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all"
                            title="Delete User"
                          >
                            <HiOutlineTrash size={20} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing with server...</p>
            </div>
          )}
          
          {!loading && users.length === 0 && (
            <div className="py-20 text-center">
              <HiOutlineUserGroup size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
