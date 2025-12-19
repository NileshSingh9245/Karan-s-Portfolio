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
      <Card hover className="group overflow-hidden cursor-pointer">
        <div 
          className={`relative ${aspectRatio} bg-gray-900 overflow-hidden`}
          onClick={() => setIsModalOpen(true)}
        >
          {/* Thumbnail Image */}
          {thumbnailUrl && !imageError ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            <div className="flex justify-end">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Open on Instagram
              </a>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-900" />
                </div>
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-4">
                  <span>👁 {stats.views}</span>
                  <span>📊 {stats.engagement}</span>
                </div>
                <Badge variant="primary">{genre}</Badge>
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
          platform,
          tools,
          stats,
          clientName,
        }}
      />
    </>
  );
}
