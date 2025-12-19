import { Card, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { 
  Megaphone, 
  Users, 
  Film, 
  Palette,
  CheckCircle2,
  ArrowRight 
} from "lucide-react";

const iconMap = {
  megaphone: Megaphone,
  users: Users,
  film: Film,
  palette: Palette,
};

interface ServiceCardProps {
  id: string;
  title: string;
  icon: keyof typeof iconMap | string;
  shortDescription: string;
  deliverables: string[];
  pricingNote: string;
  featured?: boolean;
}

export default function ServiceCard({
  id,
  title,
  icon,
  shortDescription,
  deliverables,
  pricingNote,
  featured = false,
}: ServiceCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Megaphone;

  return (
    <Card hover className="h-full flex flex-col">
      <CardBody className="flex flex-col h-full">
        {featured && (
          <Badge variant="primary" className="mb-4 w-fit">
            Popular
          </Badge>
        )}
        
        <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit">
          <IconComponent className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {shortDescription}
        </p>
        
        <div className="mb-4 flex-grow">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            What's Included:
          </p>
          <ul className="space-y-2">
            {deliverables.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            {deliverables.length > 4 && (
              <li className="text-sm text-primary-600 dark:text-primary-400">
                +{deliverables.length - 4} more...
              </li>
            )}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {pricingNote}
          </p>
          <Link href={`/services#${id}`}>
            <Button variant="outline" fullWidth>
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
