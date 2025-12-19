import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Portfolio",
  description: "Browse my collection of Instagram Reels and creative work. From digital marketing campaigns to viral social media content - see the results I've delivered for clients across India.",
  keywords: [
    "instagram reels portfolio",
    "video editing samples",
    "social media content",
    "digital marketing work",
    "creative portfolio india",
  ],
});

export { default } from "./page";
