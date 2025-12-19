import Link from "next/link";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";

const footerLinks = {
  services: [
    { label: "Digital Marketing", href: "/services#digital-marketing" },
    { label: "Social Media Management", href: "/services#social-media" },
    { label: "Video Editing", href: "/services#video-editing" },
    { label: "Graphic Design", href: "/services#graphic-design" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Stock Videos", href: "/stock-videos" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="text-3xl font-bold text-white hover:text-primary-400 transition-colors inline-block mb-4"
              >
                KARAN
              </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Professional Digital Marketing & Creative Freelancer specializing in Social Media Management, Video Editing, and Digital Marketing Growth for Indian businesses across all platforms.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:kdkaranwork@gmail.com"
                  className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>kdkaranwork@gmail.com</span>
                </a>
                <a
                  href="tel:+916201821776"
                  className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+91 6201821776</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>India</span>
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} Karan. All rights reserved.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:kdkaranwork@gmail.com"
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
