
import { Link, useLocation } from "react-router-dom";
import { Briefcase, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function NavigationLinks() {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: "Jobs",
      href: "/",
      icon: Briefcase
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare
    },
    {
      title: "Post Job",
      href: "/post-job",
      icon: Plus
    }
  ];

  return (
    <div className="hidden md:flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center space-x-2 text-sm transition-colors hover:text-white/80",
            location.pathname === item.href
              ? "text-white"
              : "text-white/60"
          )}
        >
          <item.icon size={18} />
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
