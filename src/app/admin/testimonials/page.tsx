"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { Plus, Edit2, Trash2, GripVertical, Save, X } from "lucide-react";

export const dynamic = 'force-dynamic';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  project_type: string;
  results: string;
  featured: boolean;
  display_order: number;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "",
    role: "",
    company: "",
    image: "",
    rating: 5,
    text: "",
    project_type: "",
    results: "",
    featured: false,
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const session = await isAuthenticated();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await fetchTestimonials();
    }
    init();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.display_order)) : 0;
        const { error } = await supabase
          .from("testimonials")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      await fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Error saving testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      await fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Error deleting testimonial");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      image: "",
      rating: 5,
      text: "",
      project_type: "",
      results: "",
      featured: false,
    });
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = testimonials.findIndex(t => t.id === draggedItem);
    const targetIndex = testimonials.findIndex(t => t.id === targetId);

    const newTestimonials = [...testimonials];
    const [removed] = newTestimonials.splice(draggedIndex, 1);
    newTestimonials.splice(targetIndex, 0, removed);

    const updates = newTestimonials.map((testimonial, index) => ({
      id: testimonial.id,
      display_order: index,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("testimonials")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }
      await fetchTestimonials();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order");
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Testimonials
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
                <Input
                  label="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  helperText="Leave blank for default avatar"
                />
              </div>

              <Textarea
                label="Testimonial Text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Project Type"
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  placeholder="e.g., Social Media Management"
                />
                <Input
                  label="Results"
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  placeholder="e.g., +300% inquiries"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    aria-label="Testimonial rating"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Testimonial
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Create"} Testimonial
                </Button>
                {editingId && (
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Testimonials List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Testimonials (Drag to reorder)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  draggable
                  onDragStart={() => handleDragStart(testimonial.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(testimonial.id)}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-move hover:border-primary-500"
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                      <span className="text-sm text-gray-500">- {testimonial.company}</span>
                      {testimonial.featured && (
                        <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{testimonial.text}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>⭐ {testimonial.rating}/5</span>
                      {testimonial.project_type && <span>• {testimonial.project_type}</span>}
                      {testimonial.results && <span>• {testimonial.results}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(testimonial)} variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(testimonial.id)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No testimonials yet. Add your first testimonial above.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
