'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { GripVertical, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface StockVideo {
  id: string;
  title: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  is_free: boolean;
  display_order: number;
  created_at: string;
}

export default function StockVideosAdmin() {
  const [videos, setVideos] = useState<StockVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    video_url: '',
    thumbnail_url: '',
    is_free: true,
  });
  const [draggedItem, setDraggedItem] = useState<StockVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('stock_videos')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = videos.length > 0 ? Math.max(...videos.map(v => v.display_order)) : 0;
        const { error } = await supabase
          .from('stock_videos')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      setFormData({ title: '', category: '', video_url: '', thumbnail_url: '', is_free: true });
      setEditingId(null);
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video. Check console for details.');
    }
  };

  const handleEdit = (video: StockVideo) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      category: video.category,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      is_free: video.is_free,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase.from('stock_videos').delete().eq('id', id);
      if (error) throw error;
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleDragStart = (video: StockVideo) => {
    setDraggedItem(video);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetVideo: StockVideo) => {
    if (!draggedItem || draggedItem.id === targetVideo.id) return;

    const newVideos = [...videos];
    const draggedIndex = newVideos.findIndex(v => v.id === draggedItem.id);
    const targetIndex = newVideos.findIndex(v => v.id === targetVideo.id);

    newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, draggedItem);

    const updates = newVideos.map((video, index) => ({
      id: video.id,
      display_order: index + 1,
    }));

    setVideos(newVideos);

    try {
      for (const update of updates) {
        await supabase
          .from('stock_videos')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchVideos();
    }

    setDraggedItem(null);
  };

  const toggleFree = async (video: StockVideo) => {
    try {
      const { error } = await supabase
        .from('stock_videos')
        .update({ is_free: !video.is_free })
        .eq('id', video.id);

      if (error) throw error;
      fetchVideos();
    } catch (error) {
      console.error('Error toggling free status:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', category: '', video_url: '', thumbnail_url: '', is_free: true });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Stock Videos</h1>
            <p className="text-gray-400">Manage your free stock video library</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Coffee Shop Morning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lifestyle, Business, Nature"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                required
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail URL *
              </label>
              <input
                type="url"
                required
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_free"
                checked={formData.is_free}
                onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_free" className="text-sm text-gray-300">
                Available for free download
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update Video' : 'Add Video'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
          <h3 className="text-blue-400 font-semibold mb-2">💡 How to use:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Add video title and category (e.g., Lifestyle, Business, Nature)</li>
            <li>Paste the direct video URL and thumbnail image URL</li>
            <li>Check "Available for free download" to make it free</li>
            <li>Drag the grip icon (☰) to reorder videos</li>
            <li>Click "FREE" badge to toggle free/premium status</li>
          </ul>
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            All Videos ({videos.length})
          </h2>

          {videos.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No stock videos yet</p>
              <p className="text-sm text-gray-500">Add your first video using the form above</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  draggable
                  onDragStart={() => handleDragStart(video)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(video)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all cursor-move"
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 pt-2">
                      <GripVertical size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-3">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm px-2 py-1 bg-gray-700 rounded text-gray-300">
                              {video.category}
                            </span>
                            <button
                              onClick={() => toggleFree(video)}
                              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                                video.is_free
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                            >
                              {video.is_free ? 'FREE' : 'PREMIUM'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {video.video_url}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
