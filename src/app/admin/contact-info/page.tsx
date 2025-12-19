'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  created_at: string;
  updated_at: string;
}

export default function ContactInfoAdmin() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    availability: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      if (data) {
        setContactInfo(data);
        setFormData({
          email: data.email,
          phone: data.phone,
          location: data.location,
          availability: data.availability,
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (contactInfo) {
        // Update existing
        const { error } = await supabase
          .from('contact_info')
          .update(formData)
          .eq('id', contactInfo.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('contact_info')
          .insert([formData]);

        if (error) throw error;
      }

      alert('Contact information saved successfully!');
      fetchContactInfo();
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact information. Check console for details.');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contact Information</h1>
            <p className="text-gray-400">Update your contact details shown across the website</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
          <h3 className="text-blue-400 font-semibold mb-2">💡 About Contact Info:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>This information appears in the footer and contact page</li>
            <li>Email and phone will be clickable links</li>
            <li>Location helps clients know your timezone/area</li>
            <li>Availability shows when you're open for new projects</li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} className="text-blue-400" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone size={16} className="text-green-400" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <MapPin size={16} className="text-red-400" />
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Globe size={16} className="text-purple-400" />
                Availability Status *
              </label>
              <select
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                aria-label="Availability status"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select availability</option>
                <option value="Available for new projects">Available for new projects</option>
                <option value="Open to opportunities">Open to opportunities</option>
                <option value="Available for freelance work">Available for freelance work</option>
                <option value="Accepting select projects">Accepting select projects</option>
                <option value="Fully booked">Fully booked</option>
                <option value="Taking limited projects">Taking limited projects</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Contact Information'}
            </button>
          </form>
        </div>

        {/* Preview Card */}
        {formData.email && (
          <div className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-blue-400" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-green-400" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-red-400" />
                <span>{formData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Globe size={18} className="text-purple-400" />
                <span>{formData.availability}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
