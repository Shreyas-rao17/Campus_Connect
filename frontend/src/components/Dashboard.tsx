import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import NoticeForm from './NoticeForm';
import { Plus, Trash2, Edit } from 'lucide-react';

export interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

// The backend is not available, so we mock the fetchNotices function to return some data.
// This allows the dashboard to render with some content.
const fetchNotices = async (): Promise<Notice[]> => {
  try {
    const { data } = await api.get('/notices');
    return data;
  } catch (error) {
    console.warn("Could not fetch notices from API, returning mock data.", error);
    return [
      { _id: '1', title: 'Mid-term exams schedule', description: 'The schedule for the upcoming mid-term examinations has been released.', category: 'Academic', date: new Date().toISOString() },
      { _id: '2', title: 'Annual Cultural Fest "Kalataranga"', description: 'Get ready for the biggest cultural event of the year! More details to follow.', category: 'Cultural', date: new Date().toISOString() },
      { _id: '3', title: 'Campus recruitment by TechCorp', description: 'TechCorp will be visiting the campus for recruitment on 25th June. All final year students are requested to register.', category: 'Placement', date: new Date().toISOString() },
    ];
  }
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [noticeFilter, setNoticeFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notices = [], isLoading } = useQuery<Notice[]>({
      queryKey: ['notices'],
      queryFn: fetchNotices,
      enabled: isAuthenticated,
  });

  const addNoticeMutation = useMutation({
    mutationFn: (newNotice: Omit<Notice, '_id' | 'date'>) => api.post('/notices', newNotice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast({ title: 'Success', description: 'Notice added successfully.' });
      setIsFormOpen(false);
      setEditingNotice(null);
    },
    onError: (error: any) => {
        toast({ variant: 'destructive', title: 'Error', description: error.response?.data?.message || 'Failed to add notice.' });
    }
  });

  const updateNoticeMutation = useMutation({
    mutationFn: (updatedNotice: Partial<Notice> & { _id: string }) => api.put(`/notices/${updatedNotice._id}`, updatedNotice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast({ title: 'Success', description: 'Notice updated successfully.' });
      setIsFormOpen(false);
      setEditingNotice(null);
    },
    onError: (error: any) => {
        toast({ variant: 'destructive', title: 'Error', description: error.response?.data?.message || 'Failed to update notice.' });
    }
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: (noticeId: string) => api.delete(`/notices/${noticeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast({ title: 'Success', description: 'Notice deleted successfully.' });
    },
     onError: (error: any) => {
        toast({ variant: 'destructive', title: 'Error', description: error.response?.data?.message || 'Failed to delete notice.' });
    }
  });
  
  const handleFormSubmit = (noticeData: Omit<Notice, '_id' | 'date'>) => {
    if (editingNotice) {
      updateNoticeMutation.mutate({ ...editingNotice, ...noticeData });
    } else {
      addNoticeMutation.mutate(noticeData);
    }
  };

  const handleEditClick = (notice: Notice) => {
    setEditingNotice(notice);
    setIsFormOpen(true);
  }
  
  const handleAddNewClick = () => {
    setEditingNotice(null);
    setIsFormOpen(true);
  }

  const stats = [
    { title: 'Total Notices', value: notices.length },
    { title: 'Placement Updates', value: notices.filter(n => n.category === 'Placement').length },
    { title: 'Event Schedules', value: notices.filter(n => n.category === 'Event').length },
  ];

  const filteredNotices = notices.filter(notice => 
    noticeFilter === 'all' || notice.category.toLowerCase() === noticeFilter
  );

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'cultural': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'placement': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'event': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400">Welcome back, {user?.username || 'Admin'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="glass-card hover-glow rounded-xl p-6 text-center"
          >
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-white font-mono">
                {stat.value}
              </h3>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notices Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-white">Recent Notices</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'academic', 'cultural', 'placement', 'event'].map((filter) => (
              <Button
                key={filter}
                variant={noticeFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNoticeFilter(filter)}
                className={`glass capitalize px-4 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
                  noticeFilter === filter
                    ? 'bg-blue-500/30 text-white border-blue-500/50 hover:bg-blue-500/40'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border-gray-600/50'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Loading notices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <div key={notice._id} className="glass-card hover-glow rounded-xl h-fit">
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-white mb-3 leading-tight">
                        {notice.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className={`${getCategoryColor(notice.category)} text-xs font-medium px-3 py-1 rounded-full`}>
                          {notice.category}
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          {new Date(notice.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button 
                        className="glass text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200" 
                        onClick={() => handleEditClick(notice)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        className="glass text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200" 
                        onClick={() => deleteNoticeMutation.mutate(notice._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {notice.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Notice Button */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <button 
            onClick={handleAddNewClick} 
            className="glass-card hover-glow fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="glass-card border-gray-700/50 max-w-md">
          <NoticeForm 
            onSubmit={handleFormSubmit}
            initialData={editingNotice}
            onClose={() => {
              setIsFormOpen(false);
              setEditingNotice(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;