
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Notice } from './Dashboard';

interface NoticeFormProps {
  onSubmit: (notice: Omit<Notice, '_id' | 'date'>) => void;
  initialData?: Notice | null;
  onClose: () => void;
}

const NoticeForm = ({ onSubmit, initialData, onClose }: NoticeFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <DialogHeader>
            <DialogTitle className="text-white">{initialData ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <Input
              placeholder="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="glass border-white/20 text-white placeholder:text-gray-400"
            />
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger className="glass border-white/20 text-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Placement">Placement</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Notice Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="glass border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
            />
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                {initialData ? 'Save Changes' : 'Create Notice'}
            </Button>
        </DialogFooter>
    </form>
  );
};

export default NoticeForm;
