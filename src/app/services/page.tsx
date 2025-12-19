import Container from "@/components/ui/Container";
import Section, { SectionHeader } from "@/components/ui/Section";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { 
  Megaphone, 
  Users, 
  Film, 
  Palette,
  CheckCircle2,
  ArrowRight,
  Target,
  Zap,
  Award
} from "lucide-react";
import servicesData from "@/data/services.json";

const iconMap = {
  megaphone: Megaphone,
  users: Users,
  film: Film,
  palette: Palette,
};

const benefits = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "Every strategy is designed to deliver measurable results and ROI",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Quick delivery without compromising on quality",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Agency-level quality at freelancer-friendly pricing",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Container>
          <SectionHeader
            title="Services"
            subtitle="Comprehensive digital marketing and creative services designed to help your business grow online"
          />

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center"
              >
                <benefit.icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Services Detail Section */}
      <Section>
        <Container>
          <div className="space-y-16">
            {servicesData.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Megaphone;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  id={service.id}
                  className={`scroll-mt-24 flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-12 items-center`}
                >
                  {/* Icon Side */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <IconComponent className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  {/* Content Side */}
                  <Card className="flex-grow">
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {service.title}
                        </h2>
                        {service.featured && (
                          <Badge variant="primary">Popular</Badge>
                        )}
                      </div>

                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        {service.description}
                      </p>

                      {/* Deliverables */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          What You Get:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.deliverables.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ideal Client */}
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Perfect For:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {service.idealClient}
                        </p>
                      </div>

                      {/* Pricing Note */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          💰 {service.pricingNote}
                        </p>
                        <Link href="/contact">
                          <Button variant="primary">
                            Get Quote
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Let's discuss your project and create a custom solution that fits your needs and budget.
            </p>
            <Link href="/contact">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
