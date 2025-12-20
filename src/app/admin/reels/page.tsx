"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { supabase, Reel } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminReelsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<Reel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    embedUrl: "",
    thumbnailUrl: "",
    genre: "",
    platform: "instagram",
    tools: "",
    views: "",
    engagement: "",
    clientName: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push("/admin/login");
      } else {
        setLoading(false);
        loadReels();
      }
    };

    checkAuth();
  }, [router]);

  const loadReels = async () => {
    try {
      const { data, error } = await supabase
        .from("reels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReels(data || []);
    } catch (error) {
      console.error("Error loading reels:", error);
    }
  };

  const openCreateModal = () => {
    setEditingReel(null);
    setFormData({
      title: "",
      description: "",
      embedUrl: "",
      thumbnailUrl: "",
      genre: "",
      platform: "instagram",
      tools: "",
      views: "",
      engagement: "",
      clientName: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (reel: Reel) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title,
      description: reel.description,
      embedUrl: reel.embedUrl,
      thumbnailUrl: reel.thumbnailUrl || "",
      genre: reel.genre,
      platform: reel.platform || "instagram",
      tools: reel.tools.join(", "),
      views: reel.stats.views,
      engagement: reel.stats.engagement,
      clientName: reel.clientName,
    });
    setIsModalOpen(true);
  };

  // Auto-fetch thumbnail from Instagram when URL is pasted
  const handleEmbedUrlChange = async (url: string) => {
    setFormData({ ...formData, embedUrl: url });

    // Check if it's an Instagram URL
    if (url.includes('instagram.com/reel/') || url.includes('instagram.com/p/')) {
      try {
        // Extract clean URL without query params
        const cleanUrl = url.split('?')[0].replace(/\/$/, '');
        
        // Use Instagram's oEmbed API to fetch thumbnail
        const response = await fetch(`https://api.instagram.com/oembed?url=${cleanUrl}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.thumbnail_url) {
            setFormData(prev => ({ ...prev, embedUrl: url, thumbnailUrl: data.thumbnail_url }));
          }
        }
      } catch (error) {
        console.log('Could not auto-fetch thumbnail:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-format Instagram URL to embed format
    let embedUrl = formData.embedUrl.trim();
    if (embedUrl.includes('instagram.com/reel/')) {
      // Remove any existing /embed or trailing slashes
      embedUrl = embedUrl.replace(/\/(embed)?\/?(\?.*)?$/, '');
      // Add /embed
      if (!embedUrl.endsWith('/embed')) {
        embedUrl = embedUrl + '/embed';
      }
    }

    const reelData = {
      title: formData.title,
      description: formData.description,
      embed_url: embedUrl,
      thumbnail_url: formData.thumbnailUrl,
      genre: formData.genre,
      platform: formData.platform,
      tools: formData.tools.split(",").map((t) => t.trim()),
      stats: {
        views: formData.views,
        engagement: formData.engagement,
      },
      client_name: formData.clientName,
    };

    try {
      if (editingReel) {
        const { error } = await supabase
          .from("reels")
          .update(reelData)
          .eq("id", editingReel.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("reels").insert([reelData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      loadReels();
    } catch (error) {
      console.error("Error saving reel:", error);
      alert("Failed to save reel. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;

    try {
      const { error } = await supabase.from("reels").delete().eq("id", id);

      if (error) throw error;

      loadReels();
    } catch (error) {
      console.error("Error deleting reel:", error);
      alert("Failed to delete reel. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Reels
          </h1>
          <Button onClick={openCreateModal} variant="primary" size="sm" className="lg:px-4 lg:py-2">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Add Reel</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {reels.map((reel) => (
            <div key={reel.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {reel.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reel.genre}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Views: {reel.stats.views}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(reel)}
                    className="p-2 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Edit reel"
                    title="Edit reel"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Delete reel"
                    title="Delete reel"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reels.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No reels found. Tap "Add" to create one.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reels.map((reel) => (
                <tr key={reel.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {reel.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {reel.genre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {reel.stats.views}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => openEditModal(reel)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      aria-label="Edit reel"
                      title="Edit reel"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reel.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      aria-label="Delete reel"
                      title="Delete reel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {reels.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No reels found. Click "Add Reel" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-lg lg:text-xl">
                {editingReel ? "Edit Reel" : "Add New Reel"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <div>
                <label htmlFor="reel-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="reel-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  required
                  placeholder="Describe what this reel achieved"
                />
              </div>

              <Input
                label="Instagram Embed URL"
                value={formData.embedUrl}
                onChange={(e) => handleEmbedUrlChange(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                helperText="Paste Instagram link - thumbnail will auto-fetch"
                required
              />

              <Input
                label="Thumbnail URL (auto-filled)"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                placeholder="Auto-filled from Instagram or paste custom URL"
              />

              <Input
                label="Genre"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                placeholder="e.g., Corporate, Tech, Lifestyle"
                required
              />

              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <Input
                label="Tools (comma-separated)"
                value={formData.tools}
                onChange={(e) =>
                  setFormData({ ...formData, tools: e.target.value })
                }
                placeholder="After Effects, Premiere Pro, DaVinci Resolve"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Views"
                  value={formData.views}
                  onChange={(e) =>
                    setFormData({ ...formData, views: e.target.value })
                  }
                  placeholder="10K"
                  required
                />

                <Input
                  label="Engagement"
                  value={formData.engagement}
                  onChange={(e) =>
                    setFormData({ ...formData, engagement: e.target.value })
                  }
                  placeholder="5.2%"
                  required
                />
              </div>

              <Input
                label="Client Name"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingReel ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
