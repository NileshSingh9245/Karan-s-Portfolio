"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Video, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Section, { SectionHeader } from "@/components/ui/Section";
import ServiceCard from "@/components/services/ServiceCard";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import ReelCard from "@/components/portfolio/ReelCard";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import servicesData from "@/data/services.json";
import testimonialsData from "@/data/testimonials.json";
import reelsData from "@/data/reels.json";

const stats = [
  { icon: Users, value: "100+", label: "Happy Clients" },
  { icon: Video, value: "500+", label: "Reels Created" },
  { icon: TrendingUp, value: "50M+", label: "Total Reach" },
  { icon: Zap, value: "5+", label: "Years Experience" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const featuredServices = servicesData.filter((service) => service.featured);
  const featuredReels = reelsData.slice(0, 6);
  const featuredTestimonials = testimonialsData.slice(0, 3);

  const words = [
    { text: "Grow" },
    { text: "Your" },
    { text: "Business" },
    { text: "with", className: "text-primary-600 dark:text-primary-400" },
    { text: "Social", className: "text-primary-600 dark:text-primary-400" },
    { text: "Media", className: "text-accent-600 dark:text-accent-400" },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 md:pt-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />
        
        <Container className="relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                🚀 Digital Marketing Specialist
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <TypewriterEffect words={words} className="text-4xl md:text-5xl lg:text-6xl" />
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Professional video editing, social media management, and digital marketing services to help Indian businesses thrive online.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Book Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg">
                  View Portfolio
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BackgroundGradient className="rounded-xl">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
                      <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </BackgroundGradient>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Featured Reels Section */}
      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <Container>
          <SectionHeader
            title="Featured Work"
            subtitle="Check out some of my recent social media content that helped clients achieve amazing results"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredReels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardSpotlight className="h-full">
                  <ReelCard {...reel} />
                </CardSpotlight>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button variant="primary" size="lg">
                View All Work
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section>
        <Container>
          <SectionHeader
            title="Services I Offer"
            subtitle="Comprehensive digital marketing and creative services tailored for your business growth"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <CardSpotlight className="h-full">
                  <ServiceCard {...service} />
                </CardSpotlight>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <Container>
          <SectionHeader
            title="Client Success Stories"
            subtitle="See what my clients say about working with me and the results they achieved"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <CardSpotlight className="h-full">
                  <TestimonialCard {...testimonial} />
                </CardSpotlight>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        <Container className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Grow Your Business?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl mb-8 text-primary-100"
            >
              Let's discuss how I can help you achieve your digital marketing goals with proven strategies and creative content.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
