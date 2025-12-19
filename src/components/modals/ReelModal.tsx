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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        {/* Instagram Embed */}
        <div className="aspect-[9/16] max-h-[70vh] bg-gray-900 flex items-center justify-center overflow-auto">
          {isLoading && (
            <div className="text-white">Loading reel...</div>
          )}
          <iframe
            src={reel.embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </div>

        {/* Details */}
        <div className="p-6 max-h-[30vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="primary">{reel.genre}</Badge>
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
