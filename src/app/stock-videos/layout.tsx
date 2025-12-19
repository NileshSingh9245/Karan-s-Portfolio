import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Stock Videos",
  description: "Premium stock videos and templates for Instagram Reels and social media. High-quality video assets optimized for various industries including fashion, food, tech, and more.",
  keywords: [
    "stock videos",
    "instagram reel templates",
    "video templates",
    "social media videos",
    "video assets",
  ],
});

export { default } from "./page";
