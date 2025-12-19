"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Play, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath: string;
  category: string;
  duration: string;
  resolution: string;
  usage: string;
  tags: string[];
}

export default function VideoCard({
  title,
  description,
  category,
  duration,
  resolution,
  usage,
  tags,
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card hover className="group overflow-hidden">
        <div className="relative aspect-[9/16] bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {/* Video Thumbnail - Replace with actual video in production */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-500 to-primary-500">
            <Play
              className={cn(
                "w-16 h-16 text-white transition-all duration-300",
                isHovered ? "scale-110 opacity-100" : "opacity-80"
              )}
            />
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="default" className="bg-black/70 text-white">
              {duration}
            </Badge>
          </div>

          {/* Hover Overlay */}
          <div
            className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300 flex flex-col items-center justify-center p-4",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors mb-3">
            <Play className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Download
          </button>
        </div>
      </div>

      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <Badge variant="primary">{category}</Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {resolution}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>

        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Best For:
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {usage}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
    </div>
  );
}
