"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Play } from "lucide-react";
import ReelModal from "@/components/modals/ReelModal";

interface ReelCardProps {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  genre: string;
  tools: string[];
  stats: {
    views: string;
    engagement: string;
  };
  clientName: string;
}

export default function ReelCard({
  title,
  description,
  embedUrl,
  genre,
  tools,
  stats,
  clientName,
}: ReelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card hover className="group overflow-hidden cursor-pointer">
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[9/16] bg-gray-200 dark:bg-gray-700 overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
            <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center text-white p-4">
              <p className="font-semibold mb-2">Click to view</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span>👁️ {stats.views}</span>
                <span>❤️ {stats.engagement}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="primary">{genre}</Badge>
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tool}
              </span>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Client: {clientName}
          </p>
        </div>
      </Card>

      {/* Modal */}
      <ReelModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        reel={{
          title,
          description,
          embedUrl,
          genre,
          tools,
          stats,
          clientName,
        }}
      />
    </>
  );
}
