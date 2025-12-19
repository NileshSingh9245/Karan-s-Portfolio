import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Services",
  description: "Professional digital marketing services including Instagram Reels creation, video editing, social media management, and graphic design. Custom packages for Indian businesses.",
  keywords: [
    "digital marketing services",
    "video editing services",
    "social media management",
    "instagram reel creation",
    "graphic design services",
    "freelance digital marketing india",
  ],
});

export { default } from "./page";
