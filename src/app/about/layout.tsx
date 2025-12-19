import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "About",
  description: "Learn about Karan, a professional digital marketing and creative freelancer with 5+ years of experience helping Indian businesses grow through Instagram Reels and strategic content.",
  keywords: [
    "about karan",
    "freelance digital marketer",
    "video editor india",
    "creative professional",
    "instagram specialist",
  ],
});

export { default } from "./page";
