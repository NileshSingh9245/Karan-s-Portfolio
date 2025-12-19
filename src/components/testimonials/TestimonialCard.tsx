import { Card, CardBody } from "@/components/ui/Card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  projectType: string;
  results: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  rating,
  text,
  projectType,
  results,
}: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardBody className="flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow italic">
          "{text}"
        </p>

        {/* Results Badge */}
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            📈 {results}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Avatar placeholder - Replace with actual image */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          
          <div className="flex-grow">
            <p className="font-semibold text-gray-900 dark:text-white">
              {name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role}, {company}
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
              {projectType}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
