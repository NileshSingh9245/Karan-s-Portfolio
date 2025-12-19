'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { GripVertical, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface HomepageStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export default function HomepageStatsAdmin() {
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: '',
  });
  const [draggedItem, setDraggedItem] = useState<HomepageStat | null>(null);

  const availableIcons = [
    '📊', '👥', '⭐', '🎯', '💼', '🚀', '📈', '🎨', '💡', '🏆',
    '📱', '💻', '🎬', '📸', '✨', '🔥', '💪', '🎉', '📺', '🎥'
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('homepage_stats')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = stats.length > 0 ? Math.max(...stats.map(s => s.display_order)) : 0;
        const { error } = await supabase
          .from('homepage_stats')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      setFormData({ label: '', value: '', icon: '' });
      setEditingId(null);
      fetchStats();
    } catch (error) {
      console.error('Error saving stat:', error);
      alert('Failed to save stat. Check console for details.');
    }
  };

  const handleEdit = (stat: HomepageStat) => {
    setEditingId(stat.id);
    setFormData({
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const { error } = await supabase.from('homepage_stats').delete().eq('id', id);
      if (error) throw error;
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
    }
  };

  const handleDragStart = (stat: HomepageStat) => {
    setDraggedItem(stat);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetStat: HomepageStat) => {
    if (!draggedItem || draggedItem.id === targetStat.id) return;

    const newStats = [...stats];
    const draggedIndex = newStats.findIndex(s => s.id === draggedItem.id);
    const targetIndex = newStats.findIndex(s => s.id === targetStat.id);

    newStats.splice(draggedIndex, 1);
    newStats.splice(targetIndex, 0, draggedItem);

    const updates = newStats.map((stat, index) => ({
      id: stat.id,
      display_order: index + 1,
    }));

    setStats(newStats);

    try {
      for (const update of updates) {
        await supabase
          .from('homepage_stats')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchStats();
    }

    setDraggedItem(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ label: '', value: '', icon: '' });
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Homepage Stats</h1>
            <p className="text-gray-400">Manage the statistics shown on your homepage</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Stat' : 'Add New Stat'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Happy Clients"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Value *
                </label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 500+"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon * (Click to select)
              </label>
              <div className="grid grid-cols-10 gap-2 mb-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 text-2xl rounded-lg transition-all ${
                      formData.icon === icon
                        ? 'bg-blue-500 ring-2 ring-blue-400 scale-110'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Or paste any emoji"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update Stat' : 'Add Stat'}
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
            <li>Add label (e.g., "Happy Clients", "Projects Completed")</li>
            <li>Add value (e.g., "500+", "1000+", "100%")</li>
            <li>Select an icon by clicking or paste any emoji</li>
            <li>Drag the grip icon (☰) to reorder stats</li>
            <li>Keep stats concise - they appear on homepage</li>
          </ul>
        </div>

        {/* Stats List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            All Stats ({stats.length})
          </h2>

          {stats.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No stats yet</p>
              <p className="text-sm text-gray-500">Add your first stat using the form above</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  draggable
                  onDragStart={() => handleDragStart(stat)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stat)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all cursor-move"
                >
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
                      <GripVertical size={20} />
                    </div>

                    <div className="text-3xl">{stat.icon}</div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{stat.value}</h3>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(stat)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
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
