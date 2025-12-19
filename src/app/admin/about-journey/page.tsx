'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { GripVertical, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface JourneyItem {
  id: string;
  year: string;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
}

export default function AboutJourneyAdmin() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
  });
  const [draggedItem, setDraggedItem] = useState<JourneyItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('about_journey')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching journey items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('about_journey')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) : 0;
        const { error } = await supabase
          .from('about_journey')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      setFormData({ year: '', title: '', description: '' });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving journey item:', error);
      alert('Failed to save journey item. Check console for details.');
    }
  };

  const handleEdit = (item: JourneyItem) => {
    setEditingId(item.id);
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journey item?')) return;

    try {
      const { error } = await supabase.from('about_journey').delete().eq('id', id);
      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting journey item:', error);
    }
  };

  const handleDragStart = (item: JourneyItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetItem: JourneyItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(i => i.id === draggedItem.id);
    const targetIndex = newItems.findIndex(i => i.id === targetItem.id);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    const updates = newItems.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    setItems(newItems);

    try {
      for (const update of updates) {
        await supabase
          .from('about_journey')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchItems();
    }

    setDraggedItem(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ year: '', title: '', description: '' });
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
            <h1 className="text-3xl font-bold text-white mb-2">Journey Timeline</h1>
            <p className="text-gray-400">Manage your professional journey milestones</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Journey Item' : 'Add New Journey Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year *
              </label>
              <input
                type="text"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2020, 2021-2022, Present"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Started My Journey, Joined ABC Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what happened during this period..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update Item' : 'Add Item'}
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
            <li>Add year/period (e.g., "2020", "2021-2022", "Present")</li>
            <li>Add title of the milestone or achievement</li>
            <li>Write detailed description of what happened</li>
            <li>Drag the grip icon (☰) to reorder timeline items</li>
            <li>Items appear chronologically on About page</li>
          </ul>
        </div>

        {/* Journey Items List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Timeline Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No journey items yet</p>
              <p className="text-sm text-gray-500">Add your first milestone using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(item)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all cursor-move relative"
                >
                  {/* Timeline connector */}
                  {index < items.length - 1 && (
                    <div className="absolute left-10 top-full h-4 w-0.5 bg-blue-500/30" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 pt-2">
                      <GripVertical size={20} />
                    </div>

                    <div className="flex-shrink-0 w-20 pt-1">
                      <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                        {item.year}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
