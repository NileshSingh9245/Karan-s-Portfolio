'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { GripVertical, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export default function AboutValuesAdmin() {
  const [values, setValues] = useState<AboutValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });
  const [draggedItem, setDraggedItem] = useState<AboutValue | null>(null);

  const availableIcons = [
    '🎯', '💡', '🚀', '⭐', '🏆', '💪', '✨', '🔥', '🎨', '💼',
    '📈', '🤝', '💎', '🌟', '🎓', '🔧', '📊', '🎬', '💻', '🌈'
  ];

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      const { data, error } = await supabase
        .from('about_values')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setValues(data || []);
    } catch (error) {
      console.error('Error fetching values:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('about_values')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = values.length > 0 ? Math.max(...values.map(v => v.display_order)) : 0;
        const { error } = await supabase
          .from('about_values')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      setFormData({ title: '', description: '', icon: '' });
      setEditingId(null);
      fetchValues();
    } catch (error) {
      console.error('Error saving value:', error);
      alert('Failed to save value. Check console for details.');
    }
  };

  const handleEdit = (value: AboutValue) => {
    setEditingId(value.id);
    setFormData({
      title: value.title,
      description: value.description,
      icon: value.icon,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this value?')) return;

    try {
      const { error } = await supabase.from('about_values').delete().eq('id', id);
      if (error) throw error;
      fetchValues();
    } catch (error) {
      console.error('Error deleting value:', error);
    }
  };

  const handleDragStart = (value: AboutValue) => {
    setDraggedItem(value);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetValue: AboutValue) => {
    if (!draggedItem || draggedItem.id === targetValue.id) return;

    const newValues = [...values];
    const draggedIndex = newValues.findIndex(v => v.id === draggedItem.id);
    const targetIndex = newValues.findIndex(v => v.id === targetValue.id);

    newValues.splice(draggedIndex, 1);
    newValues.splice(targetIndex, 0, draggedItem);

    const updates = newValues.map((value, index) => ({
      id: value.id,
      display_order: index + 1,
    }));

    setValues(newValues);

    try {
      for (const update of updates) {
        await supabase
          .from('about_values')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchValues();
    }

    setDraggedItem(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon: '' });
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
            <h1 className="text-3xl font-bold text-white mb-2">Core Values</h1>
            <p className="text-gray-400">Manage your core values shown on About page</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Value' : 'Add New Value'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g., Quality First"
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
                rows={3}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this core value..."
              />
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
                {editingId ? 'Update Value' : 'Add Value'}
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
            <li>Add value title (e.g., "Quality First", "Client Satisfaction")</li>
            <li>Write a brief description explaining this value</li>
            <li>Select an icon by clicking or paste any emoji</li>
            <li>Drag the grip icon (☰) to reorder values</li>
            <li>Values appear as cards on About page</li>
          </ul>
        </div>

        {/* Values List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            All Values ({values.length})
          </h2>

          {values.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No values yet</p>
              <p className="text-sm text-gray-500">Add your first value using the form above</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {values.map((value) => (
                <div
                  key={value.id}
                  draggable
                  onDragStart={() => handleDragStart(value)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(value)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all cursor-move"
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 pt-2">
                      <GripVertical size={20} />
                    </div>

                    <div className="text-3xl pt-1">{value.icon}</div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{value.title}</h3>
                      <p className="text-sm text-gray-400">{value.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(value)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(value.id)}
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
