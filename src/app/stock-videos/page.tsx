"use client";

import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import Section, { SectionHeader } from "@/components/ui/Section";
import VideoCard from "@/components/videos/VideoCard";
import Button from "@/components/ui/Button";
import stockVideosData from "@/data/stockVideos.json";

const categories = [
  "All",
  "Product Showcase",
  "Food & Beverage",
  "Fashion & Lifestyle",
  "Fitness & Health",
  "Real Estate",
  "Business & Corporate",
  "E-commerce",
  "Events & Entertainment",
];

export default function StockVideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "All") return stockVideosData;
    return stockVideosData.filter((video) => video.category === selectedCategory);
  }, [selectedCategory]);

  const visibleVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <>
      <Section className="bg-gradient-to-br from-accent-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Container>
          <SectionHeader
            title="Stock Videos"
            subtitle="Premium stock videos and templates ready for your next project. All videos are optimized for Instagram Reels and social media."
          />

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleCount(8);
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {visibleVideos.length} of {filteredVideos.length} videos
            </p>
          </div>

          {/* Videos Grid */}
          {visibleVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {visibleVideos.map((video) => (
                  <VideoCard key={video.id} {...video} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button variant="primary" size="lg" onClick={loadMore}>
                    Load More Videos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No videos found in this category.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-16 p-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Need Custom Videos?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
              Can't find what you're looking for? I can create custom videos tailored specifically to your brand and requirements.
            </p>
            <div className="text-center">
              <Button variant="primary" size="lg">
                Contact for Custom Work
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
