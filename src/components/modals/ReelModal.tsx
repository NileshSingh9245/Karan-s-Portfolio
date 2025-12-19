"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Badge from "@/components/ui/Badge";
import { useState } from "react";

interface ReelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reel: {
    title: string;
    description: string;
    embedUrl: string;
    genre: string;
    platform?: string;
    tools: string[];
    stats: {
      views: string;
      engagement: string;
    };
    clientName?: string;
  };
}

export default function ReelModal({ open, onOpenChange, reel }: ReelModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const platform = reel.platform || 'instagram';
  
  // Determine aspect ratio based on platform
  const aspectRatio = platform === 'youtube' ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row max-h-[95vh]">
          {/* Video Section - Top on mobile, Left on desktop */}
          <div className="lg:w-1/2 bg-gray-900 flex items-center justify-center relative">
            <div className={`${aspectRatio} w-full max-h-[50vh] lg:max-h-full bg-gray-900 flex items-center justify-center`}>
              {isLoading && (
                <div className="text-white">Loading reel...</div>
              )}
              <iframe
                src={reel.embedUrl}
                title={reel.title}
                className={`w-full h-full border-0 ${isLoading ? 'hidden' : 'block'}`}
                allowFullScreen
                allow="autoplay; encrypted-media"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Details Section - Bottom on mobile, Right on desktop */}
          <div className="lg:w-1/2 p-4 lg:p-6 bg-white dark:bg-gray-800 overflow-y-auto max-h-[45vh] lg:max-h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <Badge variant="primary">{reel.genre}</Badge>
                {platform && (
                  <Badge className="capitalize">{platform}</Badge>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {reel.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {reel.description}
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Views</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {reel.stats.views}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Engagement</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {reel.stats.engagement}
                  </p>
                </div>
              </div>

              {reel.clientName && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {reel.clientName}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tools Used</p>
                <div className="flex flex-wrap gap-2">
                  {reel.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
