"use client";

import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import Section, { SectionHeader } from "@/components/ui/Section";
import ReelCard from "@/components/portfolio/ReelCard";
import Button from "@/components/ui/Button";
import { generateSEO } from "@/lib/seo";
import reelsData from "@/data/reels.json";

const genres = ["All", "Digital Marketing", "Reels", "Ads", "Branding", "Social Media"];

export default function PortfolioPage() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredReels = useMemo(() => {
    if (selectedGenre === "All") return reelsData;
    return reelsData.filter((reel) => reel.genre === selectedGenre);
  }, [selectedGenre]);

  const visibleReels = filteredReels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReels.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <>
      <Section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Container>
          <SectionHeader
            title="Portfolio"
            subtitle="Browse through my collection of Instagram Reels and creative work that helped clients achieve exceptional results"
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedGenre(genre);
                  setVisibleCount(9);
                }}
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {visibleReels.length} of {filteredReels.length} reels
            </p>
          </div>

          {/* Reels Grid */}
          {visibleReels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {visibleReels.map((reel) => (
                  <ReelCard key={reel.id} {...reel} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button variant="primary" size="lg" onClick={loadMore}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No reels found in this category.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
