"use client";

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Video, Upload, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/reels">
            <Card hover className="p-6 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Video className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Reels
                  </h3>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/uploads">
            <Card hover className="p-6 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-lg">
                  <Upload className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Uploads
                  </h3>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Coming Soon
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Start Guide
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              1. <strong>Manage Reels:</strong> Add, edit, or delete your Instagram reels
            </p>
            <p>
              2. <strong>Manage Uploads:</strong> Upload videos and images for your stock library
            </p>
            <p>
              3. All changes are instantly reflected on your live portfolio
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
