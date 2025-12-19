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
  platform?: string;
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
  thumbnailUrl,
  genre,
  platform = "instagram",
  tools,
  stats,
  clientName,
}: ReelCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract Instagram URL from embed URL
  const instagramUrl = embedUrl.replace('/embed', '');

  // Determine aspect ratio based on platform
  const aspectRatio = 
    platform === 'youtube' ? 'aspect-video' : 
    platform === 'tiktok' ? 'aspect-[9/16]' :
    platform === 'facebook' || platform === 'linkedin' ? 'aspect-square' :
    'aspect-[4/5]'; // Instagram default

  return (
    <>
      <Card hover className="group overflow-hidden">
        <div className={`relative ${aspectRatio} bg-gray-900 overflow-hidden`}>
          {/* Instagram Embed - plays directly on card */}
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
          
          {/* Overlay with actions - appears on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 pointer-events-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="pointer-events-auto px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Details
            </button>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Open on Instagram
            </a>
            <div className="flex items-center gap-4 text-white text-sm">
              <span>👁️ {stats.views}</span>
              <span>❤️ {stats.engagement}</span>
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
          platform,
          tools,
          stats,
          clientName,
        }}
      />
    </>
  );
}
