import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Contact",
  description: "Get in touch to discuss your digital marketing project. Free consultation for Instagram Reels, video editing, and social media management services.",
  keywords: [
    "contact digital marketer",
    "hire video editor",
    "book consultation",
    "freelance services india",
    "get quote",
  ],
});

export { default } from "./page";
