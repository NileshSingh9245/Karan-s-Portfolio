import Container from "@/components/ui/Container";
import Section, { SectionHeader } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  Award, 
  Target, 
  Heart, 
  TrendingUp,
  Code,
  Palette,
  Video,
  Wand2,
  Brain,
  Sparkles,
  ArrowRight
} from "lucide-react";

const tools = [
  { name: "DaVinci Resolve", icon: Video, category: "Video Editing" },
  { name: "Photoshop", icon: Palette, category: "Image Editing" },
  { name: "Illustrator", icon: Code, category: "Graphic Design" },
  { name: "Canva", icon: Sparkles, category: "Design" },
  { name: "Sora", icon: Wand2, category: "AI Video" },
  { name: "OpenAI", icon: Brain, category: "AI Tools" },
  { name: "Gemini", icon: Brain, category: "AI Tools" },
];

const values = [
  {
    icon: Target,
    title: "Results-Focused",
    description: "Every project is approached with clear goals and measurable outcomes in mind.",
  },
  {
    icon: Heart,
    title: "Client-Centric",
    description: "Your success is my success. I'm committed to understanding and exceeding your expectations.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "Premium quality work that stands out and delivers real value to your business.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description: "Always staying updated with the latest trends, tools, and strategies in digital marketing.",
  },
];

const journey = [
  {
    year: "2019",
    title: "Started Freelancing",
    description: "Began offering video editing services to local businesses in India.",
  },
  {
    year: "2020",
    title: "Instagram Focus",
    description: "Specialized in Instagram Reels and short-form content as they gained popularity.",
  },
  {
    year: "2021",
    title: "Digital Marketing",
    description: "Expanded services to include comprehensive digital marketing strategies.",
  },
  {
    year: "2022",
    title: "100+ Clients",
    description: "Reached milestone of serving over 100 satisfied clients across India.",
  },
  {
    year: "2023-24",
    title: "Agency-Level Quality",
    description: "Established reputation for delivering premium, agency-level work at competitive freelancer rates.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
                👋 Nice to meet you!
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                I'm Karan, Your Digital Marketing Partner
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                A passionate Digital Marketing & Creative Freelancer with 5+ years of experience helping Indian businesses grow their online presence through powerful Instagram Reels, engaging content, and strategic marketing.
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                I believe that every business, no matter the size, deserves premium-quality marketing that drives real results. That's why I combine agency-level expertise with personalized freelancer service to help you achieve your goals.
              </p>
              
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Let's Work Together
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white p-8">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-xl font-semibold">
                    Creating Content That Converts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section>
        <Container>
          <SectionHeader
            title="What I Believe In"
            subtitle="The core values that drive every project I work on"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} hover>
                <CardBody className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full w-fit">
                    <value.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Journey Section */}
      <Section className="bg-gray-50 dark:bg-gray-800/50">
        <Container>
          <SectionHeader
            title="My Journey"
            subtitle="How I became a trusted partner for businesses across India"
          />
          
          <div className="max-w-4xl mx-auto">
            {journey.map((milestone, index) => (
              <div
                key={index}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                {index !== journey.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-primary-300 dark:bg-primary-700" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                
                <Card>
                  <CardBody>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tools Section */}
      <Section>
        <Container>
          <SectionHeader
            title="Tools & Technologies"
            subtitle="The professional tools I use to create exceptional work"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} hover>
                <CardBody className="text-center">
                  <tool.icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.category}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By The Numbers
            </h2>
            <p className="text-xl text-primary-100">
              Results that speak for themselves
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Reels Created</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50M+</div>
              <div className="text-primary-100">Total Reach</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">5+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container>
          <Card className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700">
            <CardBody className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Work Together?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's create something amazing for your business. I'm just one message away!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Get In Touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" size="lg">
                    View My Work
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Container>
      </Section>
    </>
  );
}
