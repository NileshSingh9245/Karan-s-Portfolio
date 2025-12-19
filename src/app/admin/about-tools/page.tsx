'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { GripVertical, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface AboutTool {
  id: string;
  name: string;
  category: string;
  icon_url: string;
  display_order: number;
  created_at: string;
}

export default function AboutToolsAdmin() {
  const [tools, setTools] = useState<AboutTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    icon_url: '',
  });
  const [draggedItem, setDraggedItem] = useState<AboutTool | null>(null);

  const toolCategories = [
    'Video Editing',
    'Design',
    'Marketing',
    'Analytics',
    'Collaboration',
    'Development',
    'Other'
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('about_tools')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('about_tools')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxOrder = tools.length > 0 ? Math.max(...tools.map(t => t.display_order)) : 0;
        const { error } = await supabase
          .from('about_tools')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      setFormData({ name: '', category: '', icon_url: '' });
      setEditingId(null);
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Failed to save tool. Check console for details.');
    }
  };

  const handleEdit = (tool: AboutTool) => {
    setEditingId(tool.id);
    setFormData({
      name: tool.name,
      category: tool.category,
      icon_url: tool.icon_url,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase.from('about_tools').delete().eq('id', id);
      if (error) throw error;
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleDragStart = (tool: AboutTool) => {
    setDraggedItem(tool);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetTool: AboutTool) => {
    if (!draggedItem || draggedItem.id === targetTool.id) return;

    const newTools = [...tools];
    const draggedIndex = newTools.findIndex(t => t.id === draggedItem.id);
    const targetIndex = newTools.findIndex(t => t.id === targetTool.id);

    newTools.splice(draggedIndex, 1);
    newTools.splice(targetIndex, 0, draggedItem);

    const updates = newTools.map((tool, index) => ({
      id: tool.id,
      display_order: index + 1,
    }));

    setTools(newTools);

    try {
      for (const update of updates) {
        await supabase
          .from('about_tools')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchTools();
    }

    setDraggedItem(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', icon_url: '' });
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
            <h1 className="text-3xl font-bold text-white mb-2">Tools & Software</h1>
            <p className="text-gray-400">Manage the tools shown in About page</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Tool' : 'Add New Tool'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Adobe Premiere Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  aria-label="Tool category"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {toolCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon URL *
              </label>
              <input
                type="url"
                required
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use logo URLs from official websites or use simple icons
              </p>
            </div>

            {formData.icon_url && (
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Icon Preview:</p>
                <img
                  src={formData.icon_url}
                  alt="Icon preview"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMzNzQxNTEiLz48dGV4dCB4PSIzMiIgeT0iMzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNCNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+P zwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update Tool' : 'Add Tool'}
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
            <li>Add tool name (e.g., Adobe Premiere Pro, Figma, Google Analytics)</li>
            <li>Select appropriate category</li>
            <li>Add icon/logo URL - use official brand logos or simple icons</li>
            <li>Drag the grip icon (☰) to reorder tools</li>
            <li>Tools are grouped by category on About page</li>
          </ul>
        </div>

        {/* Tools List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            All Tools ({tools.length})
          </h2>

          {tools.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No tools yet</p>
              <p className="text-sm text-gray-500">Add your first tool using the form above</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  draggable
                  onDragStart={() => handleDragStart(tool)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(tool)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all cursor-move"
                >
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
                      <GripVertical size={20} />
                    </div>

                    <img
                      src={tool.icon_url}
                      alt={tool.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiMzNzQxNTEiLz48dGV4dCB4PSIyNCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlDQTNCNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+P zwvdGV4dD48L3N2Zz4=';
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                      <span className="text-sm px-2 py-1 bg-gray-700 rounded text-gray-300">
                        {tool.category}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
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
