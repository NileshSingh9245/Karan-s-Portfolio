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
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden bg-gray-900">
        {/* Video Embed */}
        <div className={`${aspectRatio} max-h-[80vh] bg-gray-900 flex items-center justify-center`}>
          {isLoading && (
            <div className="text-white">Loading reel...</div>
          )}
          <iframe
            src={reel.embedUrl}
            title={reel.title}
            className={`w-full h-full border-0 ${isLoading ? 'hidden' : 'block'}`}
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Details */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2">
              <Badge variant="primary">{reel.genre}</Badge>
              {platform && (
                <Badge className="capitalize">{platform}</Badge>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {reel.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {reel.description}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Views:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {reel.stats.views}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Engagement:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {reel.stats.engagement}
              </span>
            </div>
            {reel.clientName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Client:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {reel.clientName}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-2">
                Tools Used:
              </span>
              <div className="flex flex-wrap gap-2">
                {reel.tools.map((tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
