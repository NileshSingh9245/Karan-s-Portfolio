"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { supabase, Upload } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, FileVideo, FileImage } from "lucide-react";

export default function AdminUploadsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    filename: "",
    fileUrl: "",
    fileType: "video" as "video" | "image",
    category: "",
    tags: "",
    duration: "",
    resolution: "",
    size: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push("/admin/login");
      } else {
        setLoading(false);
        loadUploads();
      }
    };

    checkAuth();
  }, [router]);

  const loadUploads = async () => {
    try {
      const { data, error } = await supabase
        .from("uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUploads(data || []);
    } catch (error) {
      console.error("Error loading uploads:", error);
    }
  };

  const openCreateModal = () => {
    setFormData({
      filename: "",
      fileUrl: "",
      fileType: "video",
      category: "",
      tags: "",
      duration: "",
      resolution: "",
      size: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uploadData = {
      filename: formData.filename,
      file_url: formData.fileUrl,
      file_type: formData.fileType,
      category: formData.category,
      tags: formData.tags.split(",").map((t) => t.trim()),
      metadata: {
        duration: formData.duration,
        resolution: formData.resolution,
        size: formData.size,
      },
    };

    try {
      const { error } = await supabase.from("uploads").insert([uploadData]);

      if (error) throw error;

      setIsModalOpen(false);
      loadUploads();
    } catch (error) {
      console.error("Error saving upload:", error);
      alert("Failed to save upload. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;

    try {
      const { error } = await supabase.from("uploads").delete().eq("id", id);

      if (error) throw error;

      loadUploads();
    } catch (error) {
      console.error("Error deleting upload:", error);
      alert("Failed to delete upload. Please try again.");
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Uploads
          </h1>
          <Button onClick={openCreateModal} variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {upload.fileType === "video" ? (
                  <FileVideo className="w-12 h-12 text-gray-400" />
                ) : (
                  <FileImage className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {upload.filename}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {upload.category}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {upload.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(upload.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {uploads.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No uploads found. Click "Add Upload" to create one.
            </div>
          )}
        </div>

        {/* Create Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Upload</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                label="Filename"
                value={formData.filename}
                onChange={(e) =>
                  setFormData({ ...formData, filename: e.target.value })
                }
                required
              />

              <Input
                label="File URL"
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                placeholder="https://..."
                required
              />

              <div>
                <label htmlFor="file-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Type
                </label>
                <select
                  id="file-type"
                  value={formData.fileType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fileType: e.target.value as "video" | "image",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  aria-label="Select file type"
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Nature, Business, Technology"
                required
              />

              <Input
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="sunset, timelapse, 4k"
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="0:30"
                />

                <Input
                  label="Resolution"
                  value={formData.resolution}
                  onChange={(e) =>
                    setFormData({ ...formData, resolution: e.target.value })
                  }
                  placeholder="1920x1080"
                />

                <Input
                  label="Size"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  placeholder="25MB"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
