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

interface Service {
  id: string;
  title: string;
  icon: string;
  short_description: string;
  description: string;
  deliverables: string[];
  ideal_client: string;
  pricing_note: string;
  featured: boolean;
  display_order: number;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    icon: "megaphone",
    short_description: "",
    description: "",
    deliverables: [],
    ideal_client: "",
    pricing_note: "",
    featured: false,
  });
  const [deliverableInput, setDeliverableInput] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const session = await isAuthenticated();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await fetchServices();
    }
    init();
  }, [router]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("services")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.display_order)) : 0;
        const { error } = await supabase
          .from("services")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      await fetchServices();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      icon: "megaphone",
      short_description: "",
      description: "",
      deliverables: [],
      ideal_client: "",
      pricing_note: "",
      featured: false,
    });
    setDeliverableInput("");
  };

  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      setFormData({
        ...formData,
        deliverables: [...(formData.deliverables || []), deliverableInput.trim()],
      });
      setDeliverableInput("");
    }
  };

  const removeDeliverable = (index: number) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables.splice(index, 1);
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = services.findIndex(s => s.id === draggedItem);
    const targetIndex = services.findIndex(s => s.id === targetId);

    const newServices = [...services];
    const [removed] = newServices.splice(draggedIndex, 1);
    newServices.splice(targetIndex, 0, removed);

    // Update display_order for all services
    const updates = newServices.map((service, index) => ({
      id: service.id,
      display_order: index,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("services")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }
      await fetchServices();
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
            Manage Services
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  label="Icon Name"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  helperText="e.g., megaphone, users, film, palette"
                  required
                />
              </div>

              <Input
                label="Short Description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                required
              />

              <Textarea
                label="Full Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deliverables
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    placeholder="Add a deliverable"
                  />
                  <Button type="button" onClick={addDeliverable} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.deliverables?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(index)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Remove deliverable"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Input
                label="Ideal Client"
                value={formData.ideal_client}
                onChange={(e) => setFormData({ ...formData, ideal_client: e.target.value })}
              />

              <Input
                label="Pricing Note"
                value={formData.pricing_note}
                onChange={(e) => setFormData({ ...formData, pricing_note: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Service
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Create"} Service
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

        {/* Services List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Services (Drag to reorder)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  draggable
                  onDragStart={() => handleDragStart(service.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(service.id)}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-move hover:border-primary-500"
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                      {service.featured && (
                        <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{service.short_description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(service)} variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(service.id)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No services yet. Add your first service above.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
