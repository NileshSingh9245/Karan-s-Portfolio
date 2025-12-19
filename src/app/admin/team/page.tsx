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

interface TeamMember {
  id: string;
  name: string;
  roles: string[];
  email: string;
  phone: string;
  bio: string;
  image: string;
  display_order: number;
}

export default function AdminTeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    roles: [],
    email: "",
    phone: "",
    bio: "",
    image: "",
  });
  const [roleInput, setRoleInput] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const session = await isAuthenticated();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      await fetchTeamMembers();
    }
    init();
  }, [router]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("team_members")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const maxOrder = teamMembers.length > 0 ? Math.max(...teamMembers.map(t => t.display_order)) : 0;
        const { error } = await supabase
          .from("team_members")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);

        if (error) throw error;
      }

      await fetchTeamMembers();
      resetForm();
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Error saving team member");
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      await fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Error deleting team member");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      roles: [],
      email: "",
      phone: "",
      bio: "",
      image: "",
    });
    setRoleInput("");
  };

  const addRole = () => {
    if (roleInput.trim()) {
      setFormData({
        ...formData,
        roles: [...(formData.roles || []), roleInput.trim()],
      });
      setRoleInput("");
    }
  };

  const removeRole = (index: number) => {
    const newRoles = [...(formData.roles || [])];
    newRoles.splice(index, 1);
    setFormData({ ...formData, roles: newRoles });
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = teamMembers.findIndex(t => t.id === draggedItem);
    const targetIndex = teamMembers.findIndex(t => t.id === targetId);

    const newTeamMembers = [...teamMembers];
    const [removed] = newTeamMembers.splice(draggedIndex, 1);
    newTeamMembers.splice(targetIndex, 0, removed);

    const updates = newTeamMembers.map((member, index) => ({
      id: member.id,
      display_order: index,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from("team_members")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }
      await fetchTeamMembers();
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
            Manage Team Members
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Team Member" : "Add New Team Member"}
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roles
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="Add a role (e.g., Developer, Video Editor)"
                  />
                  <Button type="button" onClick={addRole} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.roles?.map((role, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                      <span className="text-sm">{role}</span>
                      <button
                        type="button"
                        onClick={() => removeRole(index)}
                        className="text-primary-600 hover:text-primary-700"
                        aria-label="Remove role"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <Textarea
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />

              <Input
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                helperText="Leave blank for default avatar"
              />

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update" : "Create"} Team Member
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

        {/* Team List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Team Members (Drag to reorder)
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  draggable
                  onDragStart={() => handleDragStart(member.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(member.id)}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-move hover:border-primary-500"
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.roles?.map((role, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{member.email}</span>
                      <span>•</span>
                      <span>{member.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(member)} variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(member.id)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No team members yet. Add your first team member above.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
