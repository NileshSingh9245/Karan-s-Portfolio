import { Card, CardBody } from "@/components/ui/Card";
import { Mail, Phone } from "lucide-react";

interface TeamMemberProps {
  name: string;
  roles: string[];
  email: string;
  phone: string;
  bio: string;
  image?: string;
}

export default function TeamMemberCard({ name, roles, email, phone, bio }: TeamMemberProps) {
  return (
    <Card className="h-full hover:shadow-xl transition-shadow duration-300">
      <CardBody className="p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
            {name.charAt(0)}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {name}
        </h3>

        {/* Roles */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {roles.map((role, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          {bio}
        </p>

        {/* Contact Info */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href={`mailto:${email}`}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="truncate">{email}</span>
          </a>
          <a
            href={`tel:${phone}`}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{phone}</span>
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
